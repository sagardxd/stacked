export interface Validator {
  id: string;
  network: string;
  name: string;
  details: string;
  logoUrl: string;
  website: string;
  voteAccountPubkey: string;
  activeStakeLamports: string;
  commission: number;
  apr: number;
  aprUpdateAt: string;  
  createdAt: string;  
  updatedAt: string;   
}