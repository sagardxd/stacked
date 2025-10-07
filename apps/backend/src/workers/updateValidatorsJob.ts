import axios from "axios";
import { config } from "@repo/config";
import type {Validator} from "@repo/types";
import { prisma } from "@repo/db";

const VALIDATOR_VOTEACCOUNTS = [
  "3N7s9zXMZ4QqvHQR15t5GNHyqc89KduzMP7423eWiD5g",
  "he1iusunGwqrNtafDtLdhsUQDFvo13z9sUa36PauBtk",
];
export async function updateValidatorsInfo() {
  try {
    console.log(config.VALIDATOR_API_URL);
    for (const va of VALIDATOR_VOTEACCOUNTS) {
    }
    const res = await axios.get(`${config.VALIDATOR_API_URL!}`, {
      headers: {
        Token: config.VALIDATOR_TOKEN!,
      },
    });
    const filtered: Validator[] = res.data.filter((v: any) =>
      VALIDATOR_VOTEACCOUNTS.includes(v.vote_account)
    );
    for (const validator of filtered) {
      await prisma.validator.upsert({
        where: { voteAccountPubkey: validator.vote_account },
        update: {
            name: validator.name,
            website: validator.www_url,
            logoUrl: validator.avatar_url,
            activeStakeLamports: validator.active_stake,
            commission: validator.commission,
            apr: 6.66,
            aprUpdateAt: new Date(),
        },
        create: {
            voteAccountPubkey: validator.vote_account,
            name: validator.name,
            website: validator.www_url,
            logoUrl: validator.avatar_url,
            activeStakeLamports: validator.active_stake,
            commission: validator.commission,
            apr: 6.66,
            aprUpdateAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("[updateValidatorsInfo] error", error);
  }
}
