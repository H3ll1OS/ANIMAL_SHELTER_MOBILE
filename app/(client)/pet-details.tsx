import { ShelterMobileApp } from '@/components/AppShell';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card, DetailRow, PrimaryButton, pressableFeedback } from '@/components';
import { getPetAvailabilityCopy, getPetHealthStatus, getPetVaccinationStatus } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientPetDetailsPage() {
  const {
    activePublicSection,
    setActivePublicSection,
    petDetailsReturnSection,
    favoritePetIds,
    selectedPet,
    shelterContact,
    selectedPetVaccines,
    selectedPetHealthRecords,
    openPetApplication,
    toggleFavoritePet,
  } = useShelterAppContext();

  return (
    <>
            {activePublicSection === 'pet-details' ? (
              selectedPet ? (
                <View style={styles.petDetailsScreen}>
                  <View style={styles.petDetailsHero}>
                    <View style={styles.petDetailsHeroTop}>
                      <Pressable style={pressableFeedback(styles.petDetailsIconButton)} onPress={() => setActivePublicSection(petDetailsReturnSection)}>
                        <Feather name="arrow-left" size={18} color={palette.ink} />
                      </Pressable>
                      <View style={styles.petDetailsHeroActions}>
                        <Pressable style={pressableFeedback(styles.petDetailsIconButton)} onPress={() => toggleFavoritePet(selectedPet.id)}>
                          <FontAwesome5 name="heart" size={16} color={favoritePetIds.includes(selectedPet.id) ? palette.clay : palette.body} solid={favoritePetIds.includes(selectedPet.id)} />
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.petDetailsHeroMedia}>
                      {selectedPet.imageUrl ? (
                        <ExpoImage source={{ uri: selectedPet.imageUrl }} style={styles.petDetailsHeroImage} contentFit="cover" />
                      ) : (
                        <>
                          <View style={styles.petDetailsHeroGlow} />
                          <View style={styles.petDetailsHeroIconWrap}>
                            <FontAwesome5 name={selectedPet.species === 'Dog' ? 'dog' : selectedPet.species === 'Cat' ? 'cat' : 'paw'} size={58} color="#ffffff" />
                          </View>
                        </>
                      )}
                    </View>
                    <View style={styles.petDetailsHeroCopy}>
                      <Text style={styles.petDetailsHeroName}>{selectedPet.name}</Text>
                      <Text style={styles.petDetailsHeroMeta}>{getPetAvailabilityCopy(selectedPet)}</Text>
                    </View>
                  </View>

                  <View style={styles.petDetailsFactRow}>
                    <View style={styles.petDetailsFactCard}>
                      <Text style={styles.petDetailsFactLabel}>Gender</Text>
                      <Text style={styles.petDetailsFactValue}>{selectedPet.gender}</Text>
                    </View>
                    <View style={styles.petDetailsFactCard}>
                      <Text style={styles.petDetailsFactLabel}>Age</Text>
                      <Text style={styles.petDetailsFactValue}>{selectedPet.age} years</Text>
                    </View>
                    <View style={styles.petDetailsFactCard}>
                      <Text style={styles.petDetailsFactLabel}>Size</Text>
                      <Text style={styles.petDetailsFactValue}>{selectedPet.size}</Text>
                    </View>
                  </View>

                  <View style={styles.petDetailsSection}>
                    <Text style={styles.petDetailsSectionTitle}>About {selectedPet.name}</Text>
                    <Text style={styles.petDetailsBodyText}>{selectedPet.description || `${selectedPet.name} is looking for a calm and loving home with a caring adopter.`}</Text>
                  </View>

                  <View style={styles.petDetailsSection}>
                    <Text style={styles.petDetailsSectionTitle}>Details</Text>
                    <View style={styles.petDetailsList}>
                      <DetailRow label="Breed" value={selectedPet.breed} />
                      <DetailRow label="Species" value={selectedPet.species} />
                      <DetailRow label="Status" value={selectedPet.status} />
                      <DetailRow label="Date Received" value={selectedPet.dateReceived} />
                      <DetailRow label="Vaccination" value={getPetVaccinationStatus(selectedPetVaccines)} />
                      <DetailRow label="Health" value={getPetHealthStatus(selectedPetHealthRecords)} positive={selectedPetHealthRecords.every((record) => !record.isCritical)} />
                    </View>
                  </View>

                  <View style={styles.petDetailsContactCard}>
                    <Text style={styles.petDetailsSectionTitle}>Contact Shelter</Text>
                    <View style={styles.petDetailsContactList}>
                      <View style={styles.petDetailsContactItem}>
                        <View style={styles.petDetailsContactIcon}>
                          <Feather name="phone" size={16} color={palette.sky} />
                        </View>
                        <View style={styles.petDetailsContactCopy}>
                          <Text style={styles.petDetailsContactLabel}>Phone</Text>
                          <Text style={styles.petDetailsContactValue}>{shelterContact?.phone ?? '(555) 123-4567'}</Text>
                        </View>
                      </View>
                      <View style={styles.petDetailsContactItem}>
                        <View style={styles.petDetailsContactIcon}>
                          <Feather name="mail" size={16} color={palette.sky} />
                        </View>
                        <View style={styles.petDetailsContactCopy}>
                          <Text style={styles.petDetailsContactLabel}>Email</Text>
                          <Text style={styles.petDetailsContactValue}>{shelterContact?.email ?? 'admin@shelter.local'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <PrimaryButton
                    label={`Continue with ${selectedPet.name}`}
                    onPress={() => {
                      openPetApplication(selectedPet.id);
                    }}
                  />
                </View>
              ) : (
                <Card title="Pet Details" subtitle="Profile">
                  <Text style={styles.helper}>Select a pet first to view the details page.</Text>
                </Card>
              )
            ) : null}
    </>
  );
}

export default function ClientPetDetailsRoute() {
  return <ShelterMobileApp initialRoleView="public" initialPublicSection="pet-details" />;
}
