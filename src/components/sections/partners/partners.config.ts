import type { ComponentType } from "react";

import type { CmsImage } from "@/lib/cms/map";

import {
  ClearflowLogo,
  HorizonLogo,
  LatticeLogo,
  MeridianLogo,
  NorthgateLogo,
  VaultlineLogo,
} from "./PartnerLogos";

export type Partner = {
  id: string;
  name: string;
  Logo: ComponentType<{ className?: string }>;
};

/**
 * What the carousel actually renders. A CMS partner carries `image`; a bundled
 * fallback carries `Logo`, which is a component reference and so can never come
 * from JSON. PartnersCarousel is a server component, so holding one crosses no
 * client boundary.
 */
export type PartnerView = {
  id: string;
  name: string;
  image: CmsImage | null;
  Logo: ComponentType<{ className?: string }> | null;
};

export const PARTNERS: Partner[] = [
  { id: "meridian", name: "Meridian", Logo: MeridianLogo },
  { id: "horizon", name: "Horizon", Logo: HorizonLogo },
  { id: "vaultline", name: "Vaultline", Logo: VaultlineLogo },
  { id: "northgate", name: "Northgate AI", Logo: NorthgateLogo },
  { id: "clearflow", name: "Clearflow", Logo: ClearflowLogo },
  { id: "lattice", name: "Lattice", Logo: LatticeLogo },
];
