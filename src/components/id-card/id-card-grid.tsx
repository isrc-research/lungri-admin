"use client";

import React, { useEffect, useState } from "react";
import idCardSvg from "@/lib/assets/lungri-id-card.svg";

interface Enumerator {
  id: string;
  name: string;
  userName: string;
  avatar: string | null;
  nepaliName: string | null;
  nepaliAddress: string | null;
  nepaliPhone: string | null;
}

interface IdCardGridProps {
  enumerators: Enumerator[];
}

const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function IdCardGrid({ enumerators }: IdCardGridProps) {
  const [cardData, setCardData] = useState<
    Array<{ id: string; svgContent: string | null }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Process each enumerator to generate their ID card
  useEffect(() => {
    const generateCards = async () => {
      setLoading(true);

      // Load SVG template once to reuse
      const response = await fetch(idCardSvg.src);
      if (!response.ok) {
        console.error("Failed to load SVG template");
        setLoading(false);
        return;
      }

      const templateSvg = await response.text();

      // Process each enumerator
      const generatedCards = await Promise.all(
        enumerators.map(async (enumerator) => {
          try {
            // Make a copy of the template for this enumerator
            let svgContent = templateSvg;

            // Replace placeholders with actual data
            svgContent = svgContent.replace(
              /@नाम/g,
              enumerator.nepaliName || "",
            );
            svgContent = svgContent.replace(
              /@ठेगाना/g,
              enumerator.nepaliAddress || "",
            );
            svgContent = svgContent.replace(
              /@सम्पर्क नं\./g,
              enumerator.nepaliPhone || "",
            );

            // Replace photo layer with avatar image if available
            if (enumerator.avatar) {
              try {
                // Convert to base64 to ensure proper embedding in SVG
                const base64Image = await getBase64FromUrl(enumerator.avatar);
                const photoLayerRegex = /<rect[^>]*id="photo-layer"[^>]*\/>/;
                const imageElement = `<image id="photo-layer" x="114" y="179" width="135" height="155" href="${base64Image}" preserveAspectRatio="xMidYMid slice"/>`;
                svgContent = svgContent.replace(photoLayerRegex, imageElement);
              } catch (avatarErr) {
                console.error(
                  `Failed to load avatar for ${enumerator.id}:`,
                  avatarErr,
                );
              }
            }

            return { id: enumerator.id, svgContent };
          } catch (error) {
            console.error(`Error generating card for ${enumerator.id}:`, error);
            return { id: enumerator.id, svgContent: null };
          }
        }),
      );

      setCardData(generatedCards);
      setLoading(false);
    };

    generateCards();
  }, [enumerators]);

  if (loading) {
    return (
      <div className="flex justify-center p-8 print:hidden">
        Loading ID cards...
      </div>
    );
  }

  return (
    <div className="id-card-grid">
      {cardData.map((card) =>
        card.svgContent ? (
          <div key={card.id} className="id-card">
            <div
              dangerouslySetInnerHTML={{ __html: card.svgContent }}
              className="id-card-content"
            />
          </div>
        ) : (
          <div key={card.id} className="id-card id-card-error">
            <p>Failed to generate ID card</p>
          </div>
        ),
      )}

      <style jsx global>{`
        .id-card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 10mm;
          padding: 10mm;
          page-break-after: always;
        }

        .id-card {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }

        .id-card-content {
          width: 85mm;
          height: auto;
        }

        .id-card-content svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .id-card-error {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 85mm;
          background-color: #f9e3e3;
          color: #a12222;
          text-align: center;
          border: 1px dashed #d32f2f;
        }

        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            margin: 0;
          }

          .id-card-grid {
            width: 190mm;
            height: 277mm;
          }

          .id-card {
            height: 85mm;
            overflow: hidden;
          }

          /* Ensure consistent sizing for SVG content */
          .id-card-content svg {
            height: 83mm;
            width: 83mm;
            object-fit: contain;
          }
        }
      `}</style>
    </div>
  );
}
