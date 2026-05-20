import type { ComponentType } from "react";

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

export const PARTNERS: readonly Partner[] = [
  { id: "meridian", name: "Meridian", Logo: MeridianLogo },
  { id: "horizon", name: "Horizon", Logo: HorizonLogo },
  { id: "vaultline", name: "Vaultline", Logo: VaultlineLogo },
  { id: "northgate", name: "Northgate AI", Logo: NorthgateLogo },
  { id: "clearflow", name: "Clearflow", Logo: ClearflowLogo },
  { id: "lattice", name: "Lattice", Logo: LatticeLogo },
] as const;
