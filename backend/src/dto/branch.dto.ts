export class CreateBranchDto {
  name: string;
  address: string;
  city: string;
}

export class UpdateBranchDto {
  name?: string;
  address?: string;
  city?: string;
}
