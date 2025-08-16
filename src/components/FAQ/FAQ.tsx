"use client";

import React, { useState } from "react";
import "./FAQ.scss";
import { useLocale, useTranslations } from "next-intl";

interface FAQAnswer {
  intro?: string;
  bulletPoints?: string[];
  conclusion?: string;
  text?: string; // For simple text answers without formatting
}

interface FAQItemProps {
  question: string;
  answer: FAQAnswer;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button
        className="faq-item__question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Collapse" : "Expand"} answer for: ${question}`}
      >
        <span className="faq-item__question-text">{question}</span>
        <span className="faq-item__icon">
          {isOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </button>
      <div className={`faq-item__answer ${isOpen ? "open" : ""}`}>
        <div className="faq-item__answer-content">
          {answer.text ? (
            <p className="faq-item__answer-text">{answer.text}</p>
          ) : (
            <>
              {answer.intro && (
                <p className="faq-item__answer-intro">{answer.intro}</p>
              )}
              {answer.bulletPoints && answer.bulletPoints.length > 0 && (
                <ul className="faq-item__answer-list">
                  {answer.bulletPoints.map((point, index) => (
                    <li key={index} className="faq-item__answer-list-item">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {answer.conclusion && (
                <p className="faq-item__answer-conclusion">{answer.conclusion}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Start with first item open
  const t = useTranslations("FAQ");
  const locale = useLocale();

  const faqItemsEN = [
    {
      question:
        "What do I need to register as a real estate agent or salesperson on My Global Hub?",
      answer: {
        intro: "You'll need the following:",
        bulletPoints: [
          "A valid national ID (cédula or passport).",
          "Your real estate license number (if applicable).",
          "A professional photo of yourself.",
          "Your office address and contact information.",
          "Active AEI membership (optional, but recommended)."
        ],
        conclusion: "⚠️ All information is verified to ensure transparency and trust between clients and agents."
      },
    },
    {
      question:
        "Can I list properties even if I'm not affiliated with a real estate agency?",
      answer: {
        text: "Yes. My Global Hub accepts independent agents as long as they complete the validation process, which includes submitting an RNC (if applicable), a valid ID, and property documentation."
      },
    },
    {
      question: "What types of properties can I list?",
      answer: {
        intro: "You may list:",
        bulletPoints: [
          "Homes and apartments for sale or rent.",
          "Lots and land.",
          "Pre-construction projects.",
          "Commercial spaces."
        ],
        conclusion: "🏗️ Each listing must include clear photos, location, price, legal status, and a brief description."
      },
    },
    {
      question: "Where will my listings appear?",
      answer: {
        intro: "Your listing will be visible in:",
        bulletPoints: [
          'The "Global Listings" section.',
          "Your agency's profile (if applicable).",
          "The public Real Estate page, accessible internationally."
        ],
        conclusion: "✨ Verified agents with AEI membership receive priority placement in search results."
      },
    },
    {
      question: "Can buyers contact me directly?",
      answer: {
        text: "No. To protect your privacy and that of the buyers, all communication takes place within the platform's internal messaging system. Only fully verified agents can view and respond to buyer inquiries."
      },
    },
    {
      question: "Does the platform charge a commission per sale?",
      answer: {
        text: "Currently, My Global Hub does not charge any direct commission on sales made by registered agents. However, promotional features or premium tools may carry a fee."
      },
    },
    {
      question: "Can I share my listings on social media?",
      answer: {
        text: "Yes. From your agent dashboard, you can generate custom links to share your properties on WhatsApp, Instagram, Facebook, and more."
      },
    },
    {
      question: "Can I upload contracts or legal documents?",
      answer: {
        intro: "Yes. We offer a secure area where you can upload:",
        bulletPoints: [
          "Purchase agreements or sales contracts.",
          "Handover/closing reports.",
          "Appraisal documents.",
          "Property titles."
        ],
        conclusion: "📁 These files are not public. They're only used for validation or in case of disputes."
      },
    },
    {
      question: "What happens when a buyer is interested in my property?",
      answer: {
        intro: "You'll receive a notification in your agent dashboard. From there, you can:",
        bulletPoints: [
          "View the buyer's profile.",
          "Coordinate showings via the internal messaging system.",
          "Upload any relevant documents."
        ]
      },
    },
    {
      question: "Can I list properties outside the Dominican Republic?",
      answer: {
        text: "Yes. If you have properties in other countries, you can list them as long as you meet the verification requirements for that specific country."
      },
    },
    {
      question: "What are the benefits of being a verified AEI member?",
      answer: {
        bulletPoints: [
          "Increased visibility across listings.",
          "A special badge on your profile.",
          "Exclusive access to verified international clients.",
          "Participation in special promotions and networking events."
        ]
      },
    },
  ];

  const faqItemsES = [
    {
      question:
        "¿Qué necesito para registrarme como vendedor o agente inmobiliario en My Global Hub?",
      answer: {
        intro: "Debes contar con:",
        bulletPoints: [
          "Tu cédula o documento de identidad vigente.",
          "Tu número de licencia inmobiliaria (si aplica).",
          "Una foto profesional tuya.",
          "Dirección y contacto de tu oficina o área de servicio.",
          "Ser miembro activo de AEI (opcional pero recomendado)."
        ],
        conclusion: "⚠️ Todos los datos son verificados para garantizar la transparencia y confianza entre clientes y agentes."
      },
    },
    {
      question:
        "¿Puedo listar propiedades aunque no esté afiliado a una agencia?",
      answer: {
        text: "Sí. My Global Hub acepta agentes independientes, siempre que completen el proceso de validación, incluyendo la presentación de su RNC (si aplica), cédula y documentación de la propiedad."
      },
    },
    {
      question: "¿Cuáles tipos de propiedades puedo listar?",
      answer: {
        intro: "Puedes listar:",
        bulletPoints: [
          "Casas y apartamentos en venta o alquiler.",
          "Terrenos y solares.",
          "Proyectos en plano.",
          "Locales comerciales."
        ],
        conclusion: "🏗️ Cada propiedad debe incluir fotos claras, ubicación, precio, estado legal y una breve descripción."
      },
    },
    {
      question: "¿Cómo funciona la visibilidad de mis publicaciones?",
      answer: {
        intro: "Tu listado se mostrará en:",
        bulletPoints: [
          'La sección de "Global Listings".',
          "El perfil de tu agencia (si aplica).",
          "El área pública de Real Estate, visible internacionalmente."
        ],
        conclusion: "✨ Agentes verificados con membresía AEI tienen prioridad en resultados de búsqueda."
      },
    },
    {
      question: "¿Los compradores pueden contactarme directamente?",
      answer: {
        text: "No. Para proteger tu privacidad y la de los compradores, todo contacto se hace a través del sistema interno de la plataforma. Solo los agentes con registro completo y validación pueden acceder a los mensajes de compradores interesados."
      },
    },
    {
      question: "¿Qué comisión cobra la plataforma por cada venta?",
      answer: {
        text: "Actualmente, My Global Hub no cobra comisión directa sobre las ventas realizadas por agentes registrados. Sin embargo, puede aplicar una tarifa si deseas destacar tu propiedad o acceder a funciones premium."
      },
    },
    {
      question: "¿Puedo compartir mis propiedades en redes sociales?",
      answer: {
        text: "Sí. Desde tu panel de control podrás generar enlaces personalizados para compartir tus listados en WhatsApp, Instagram, Facebook y más."
      },
    },
    {
      question: "¿La plataforma permite subir contratos o documentos legales?",
      answer: {
        intro: "Sí. Contamos con un área segura donde puedes cargar:",
        bulletPoints: [
          "Contratos de venta o promesas de compraventa.",
          "Actas de entrega.",
          "Documentos de tasación.",
          "Títulos de propiedad."
        ],
        conclusion: "📁 Estos archivos no son públicos. Solo se usan como respaldo en caso de validación o disputa."
      },
    },
    {
      question: "¿Qué pasa si un comprador muestra interés en mi propiedad?",
      answer: {
        intro: "Recibirás una notificación en tu cuenta de agente. Desde allí podrás:",
        bulletPoints: [
          "Ver el perfil del comprador.",
          "Coordinar visitas a través de la mensajería interna.",
          "Subir documentación relacionada."
        ]
      },
    },
    {
      question:
        "¿Puedo listar propiedades en otros países además de República Dominicana?",
      answer: {
        text: "Sí. Si tienes propiedades en el extranjero, puedes listarlas siempre que cumplas con los requisitos de verificación correspondientes al país en cuestión."
      },
    },
    {
      question: "¿Qué beneficios tengo al ser miembro verificado de AEI?",
      answer: {
        bulletPoints: [
          "Mayor visibilidad en los listados.",
          "Distintivo especial en tu perfil.",
          "Acceso exclusivo a clientes internacionales validados.",
          "Participación en promociones especiales y eventos de networking."
        ]
      },
    },
  ];

  const faqItems = locale === "en" ? faqItemsEN : faqItemsES;

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="g_section_wrap faq">
      <div className="g_container faq__container">
        <div className="faq__inner">
          <div className="faq__header">
            <div className="faq__header-left">
              <h2 className="faq__title">{t("title")}</h2>
            </div>
            <div className="faq__header-right">
              <p className="faq__description">{t("description")}</p>
              <button className="faq__cta-button">
                {t("getStartedBtnText")}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="faq__content">
            <div className="faq__items">
              {faqItems.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
