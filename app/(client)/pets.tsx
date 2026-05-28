import { ShelterMobileApp } from '@/components/AppShell';
import { Pressable, Text, View } from 'react-native';
import type { SpeciesFilter } from '@/types/navigation';
import { ClientPetBrowseCard, PrimaryButton, StatusBadge, pressableFeedback } from '@/components';
import { getPetVaccinationStatus } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientPetsPage() {
  const {
    store,
    activePublicSection,
    setActivePublicSection,
    speciesFilter,
    setSpeciesFilter,
    favoritePetIds,
    useClientPetGrid,
    adoptPetCardWidthStyle,
    adoptFilteredPets,
    adoptSpotlightPet,
    openPetDetails,
    toggleFavoritePet,
  } = useShelterAppContext();

  return (
    <>
            {activePublicSection === 'pets' ? (
              <View style={styles.clientAdoptScreen}>
                <View style={styles.clientAdoptFilterBar}>
                  <View style={styles.clientAdoptFilterChipRow}>
                    {(['all', 'Dog', 'Cat'] as SpeciesFilter[]).map((filter) => (
                      <Pressable
                        key={filter}
                        style={pressableFeedback([styles.clientAdoptFilterChip, speciesFilter === filter && styles.clientAdoptFilterChipActive])}
                        onPress={() => setSpeciesFilter(filter)}>
                        <Text style={[styles.clientAdoptFilterChipText, speciesFilter === filter && styles.clientAdoptFilterChipTextActive]}>{filter}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.clientAdoptResultsCard}>
                  <View style={styles.clientAdoptResultsHeader}>
                    <View>
                      <Text style={styles.clientSectionLabel}>Available Pets</Text>
                      <Text style={styles.clientAdoptResultsTitle}>{adoptFilteredPets.length} curated matches</Text>
                      <Text style={styles.clientAdoptResultsText}>Each profile opens a full pet details page with care notes, shelter contact information, and next steps.</Text>
                    </View>
                    <Pressable style={pressableFeedback(styles.clientAdoptResultsAction)} onPress={() => setActivePublicSection('account')}>
                      <Text style={styles.clientAdoptResultsActionText}>Your requests</Text>
                    </Pressable>
                  </View>

                  <View style={[styles.clientAdoptResultsList, useClientPetGrid && styles.clientAdoptResultsListGrid]}>
                    {adoptFilteredPets.map((pet) => (
                      <ClientPetBrowseCard
                        key={pet.id}
                        pet={pet}
                        active={adoptSpotlightPet?.id === pet.id}
                        isFavorite={favoritePetIds.includes(pet.id)}
                        onToggleFavorite={() => toggleFavoritePet(pet.id)}
                        widthStyle={adoptPetCardWidthStyle}
                        variant="adopt"
                        onPress={() => openPetDetails(pet.id, 'pets')}
                      />
                    ))}
                  </View>

                  {adoptFilteredPets.length === 0 ? (
                    <View style={styles.clientAdoptEmptyState}>
                      <Text style={styles.clientInfoTitle}>No pets match this search yet</Text>
                      <Text style={styles.clientInfoText}>Try switching the species chip or using a broader keyword like Golden, Dog, or Cat.</Text>
                    </View>
                  ) : null}
                </View>

                {adoptSpotlightPet ? (
                  <View style={styles.clientAdoptSpotlightCard}>
                    <View style={styles.clientAdoptSpotlightHeader}>
                      <View style={styles.clientAdoptSpotlightCopy}>
                        <Text style={styles.clientSectionLabel}>Adoption Concierge</Text>
                        <Text style={styles.clientAdoptSpotlightTitle}>Interested in {adoptSpotlightPet.name}?</Text>
                        <Text style={styles.clientAdoptSpotlightText}>Open the premium pet profile to review health notes, vaccination status, and shelter contact details before you continue.</Text>
                      </View>
                      <StatusBadge label={adoptSpotlightPet.status} tone="neutral" />
                    </View>

                    <View style={styles.clientAdoptSpotlightFacts}>
                      <View style={styles.clientAdoptSpotlightFact}>
                        <Text style={styles.clientAdoptSpotlightFactLabel}>Breed</Text>
                        <Text style={styles.clientAdoptSpotlightFactValue}>{adoptSpotlightPet.breed}</Text>
                      </View>
                      <View style={styles.clientAdoptSpotlightFact}>
                        <Text style={styles.clientAdoptSpotlightFactLabel}>Profile</Text>
                        <Text style={styles.clientAdoptSpotlightFactValue}>{adoptSpotlightPet.gender} / {adoptSpotlightPet.age} yrs</Text>
                      </View>
                      <View style={styles.clientAdoptSpotlightFact}>
                        <Text style={styles.clientAdoptSpotlightFactLabel}>Shelter Care</Text>
                        <Text style={styles.clientAdoptSpotlightFactValue}>{getPetVaccinationStatus(store.vaccineSchedules.filter((schedule) => schedule.petId === adoptSpotlightPet.id && !schedule.deleted))}</Text>
                      </View>
                    </View>

                    <PrimaryButton label={`View ${adoptSpotlightPet.name}'s full profile`} onPress={() => openPetDetails(adoptSpotlightPet.id, 'pets')} />
                  </View>
                ) : null}
              </View>
            ) : null}
    </>
  );
}

export default function ClientPetsRoute() {
  return <ShelterMobileApp initialRoleView="public" initialPublicSection="pets" />;
}
