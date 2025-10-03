export interface Validator {
    id: string
    name: string
    avatar_url: string
    active_stake: number
    website: string
    vote_account: string
    commission: number
    jito_enabled: boolean
    jito_commission: number
    apr: number
}

export interface ValidatorDetails extends Validator {
    details?: string;        
    stake_pools_list?: string[];
    software_client: string;
  }