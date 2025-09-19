import type { Schema, Struct } from '@strapi/strapi';

export interface FooterLinksFooterLinks extends Struct.ComponentSchema {
  collectionName: 'components_footer_links_footer_links';
  info: {
    displayName: 'Footer Links';
  };
  attributes: {
    links: Schema.Attribute.Component<'link-item.link-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InventorySettingsInventorySettings
  extends Struct.ComponentSchema {
  collectionName: 'components_inventory_settings_inventory_settings';
  info: {
    displayName: 'Inventory Settings';
  };
  attributes: {
    allowBackorder: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    lowStockThreshold: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'5'>;
    quantity: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>;
    trackQuantity: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface LinkItemLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_link_item_link_items';
  info: {
    displayName: 'Link Item';
  };
  attributes: {
    external: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductVariantProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_variant_product_variants';
  info: {
    displayName: 'Product Variant';
  };
  attributes: {
    attributes: Schema.Attribute.JSON;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    inventory: Schema.Attribute.BigInteger;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    sku: Schema.Attribute.String;
  };
}

export interface SeoSettingsSeoSettings extends Struct.ComponentSchema {
  collectionName: 'components_seo_settings_seo_settings';
  info: {
    displayName: 'SEO Settings';
  };
  attributes: {
    description: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface SocialMediaLinksSocialMediaLinks
  extends Struct.ComponentSchema {
  collectionName: 'components_social_media_links_social_media_links';
  info: {
    displayName: 'Social Media Links';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    tiktok: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    youtube: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer-links.footer-links': FooterLinksFooterLinks;
      'inventory-settings.inventory-settings': InventorySettingsInventorySettings;
      'link-item.link-item': LinkItemLinkItem;
      'product-variant.product-variant': ProductVariantProductVariant;
      'seo-settings.seo-settings': SeoSettingsSeoSettings;
      'social-media-links.social-media-links': SocialMediaLinksSocialMediaLinks;
    }
  }
}
