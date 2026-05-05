import { ClientAccountPage } from '@/app/(client)/profile';
import { ClientDonationsPage } from '@/app/(client)/donations';
import { ClientHomePage } from '@/app/(client)/index';
import { ClientPetApplicationPage } from '@/app/(client)/adoption';
import { ClientPetDetailsPage } from '@/app/(client)/pet-details';
import { ClientPetsPage } from '@/app/(client)/pets';

export function ClientWorkspace() {
  return (
    <>
      <ClientHomePage />
      <ClientPetDetailsPage />
      <ClientPetApplicationPage />
      <ClientPetsPage />
      <ClientDonationsPage />
      <ClientAccountPage />
    </>
  );
}
