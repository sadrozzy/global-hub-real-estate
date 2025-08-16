"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { PropertyDetailData } from "@/types/property";
import "./DetailHeader.scss";

interface DetailHeaderProps {
  property: PropertyDetailData;
}

export default function DetailHeader({ property }: DetailHeaderProps) {
  const t = useTranslations("DetailPage");

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number, unit: string) => {
    return `${area.toLocaleString()} ${unit}`;
  };

  return (
    <div className="detail-header">
      <div className="detail-header__container">
        {/* Header Section */}
        <div className="detail-header__top">
          <div className="detail-header__left">
            {/* Badges */}
            <div className="detail-header__badges">
              {property.isCertified && (
                <span className="detail-header__badge detail-header__badge--certified">
                  {t("badges.certified")}
                </span>
              )}
              <span className="detail-header__badge detail-header__badge--for-sale">
                {t("badges.forSale")}
              </span>
            </div>

            {/* Title */}
            <h1 className="detail-header__title">{property.title}</h1>

            {/* Location */}
            <div className="detail-header__location">
              <Image
                src="/icons/location-detail.png"
                alt="Location"
                width={16}
                height={16}
                className="detail-header__location-icon"
              />
              <span>
                {property.location.address}, {property.location.city}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="detail-header__right">
            <div className="detail-header__price">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
