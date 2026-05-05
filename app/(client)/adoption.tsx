import { ShelterMobileApp } from '@/components/AppShell';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card, Field, PrimaryButton } from '@/components';
import { getPetVaccinationStatus } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientPetApplicationPage() {
  const {
    activePublicSection,
    setActivePublicSection,
    petApplicationUploads,
    petApplicationError,
    setPetApplicationError,
    petApplicationFieldErrors,
    isSubmittingPetApplication,
    petApplicationForm,
    setPetApplicationForm,
    isTablet,
    clientSplitFieldStyle,
    clientFullFieldStyle,
    selectedPet,
    selectedPetVaccines,
    clearPetApplicationFieldError,
    pickSupportingDocuments,
    removeSupportingDocument,
    submitPetApplication,
  } = useShelterAppContext();

  return (
    <>
            {activePublicSection === 'pet-application' ? (
              selectedPet ? (
                <View style={styles.petApplicationScreen}>
                  <View style={styles.petApplicationHero}>
                    <View style={styles.petApplicationHeroTop}>
                      <Pressable style={styles.petApplicationBackButton} onPress={() => setActivePublicSection('pet-details')}>
                        <Feather name="arrow-left" size={18} color={palette.ink} />
                      </Pressable>
                      <View style={styles.petApplicationHeroBadge}>
                        <Text style={styles.petApplicationHeroBadgeText}>Application</Text>
                      </View>
                    </View>

                    <View style={styles.petApplicationHeroBody}>
                      <View style={styles.petApplicationHeroMedia}>
                        <View style={styles.petApplicationHeroGlow} />
                        <View style={styles.petApplicationHeroIconWrap}>
                          <FontAwesome5 name={selectedPet.species === 'Dog' ? 'dog' : selectedPet.species === 'Cat' ? 'cat' : 'paw'} size={48} color="#ffffff" />
                        </View>
                      </View>
                      <View style={styles.petApplicationHeroCopy}>
                        <Text style={styles.petApplicationKicker}>Adopt {selectedPet.name}</Text>
                        <Text style={styles.petApplicationTitle}>Complete a premium adoption application.</Text>
                        <Text style={styles.petApplicationText}>Share your contact details and a short care plan so the shelter can review your request faster.</Text>
                      </View>
                    </View>

                    <View style={styles.petApplicationFactRow}>
                      <View style={styles.petApplicationFactCard}>
                        <Text style={styles.petApplicationFactLabel}>Breed</Text>
                        <Text style={styles.petApplicationFactValue}>{selectedPet.breed}</Text>
                      </View>
                      <View style={styles.petApplicationFactCard}>
                        <Text style={styles.petApplicationFactLabel}>Profile</Text>
                        <Text style={styles.petApplicationFactValue}>{selectedPet.gender} / {selectedPet.age} yrs</Text>
                      </View>
                      <View style={styles.petApplicationFactCard}>
                        <Text style={styles.petApplicationFactLabel}>Care Status</Text>
                        <Text style={styles.petApplicationFactValue}>{getPetVaccinationStatus(selectedPetVaccines)}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.petApplicationLayout, isTablet && styles.petApplicationLayoutWide]}>
                    <View style={[styles.petApplicationFormCard, isTablet && styles.petApplicationFormCardWide]}>
                      <Text style={styles.clientSectionLabel}>Applicant Details</Text>
                      <Text style={styles.petApplicationFormTitle}>Tell the shelter about your home</Text>
                      <Text style={styles.petApplicationFormText}>Keep the answers clear and practical. The team uses this information to verify fit and schedule the next step.</Text>

                      <View style={[styles.clientFormGrid, isTablet && styles.clientFormGridWide]}>
                        <View style={[styles.clientFormGridItem, clientSplitFieldStyle]}>
                          <Field label="Full Name" required error={petApplicationFieldErrors.fullName} value={petApplicationForm.fullName} onChangeText={(value) => {
                            setPetApplicationError(null);
                            clearPetApplicationFieldError('fullName');
                            setPetApplicationForm((current) => ({ ...current, fullName: value }));
                          }} />
                        </View>
                        <View style={[styles.clientFormGridItem, clientSplitFieldStyle]}>
                          <Field label="Phone" required error={petApplicationFieldErrors.phone} value={petApplicationForm.phone} onChangeText={(value) => {
                            setPetApplicationError(null);
                            clearPetApplicationFieldError('phone');
                            setPetApplicationForm((current) => ({ ...current, phone: value }));
                          }} />
                        </View>
                        <View style={[styles.clientFormGridItem, clientFullFieldStyle]}>
                          <Field label="Email" required error={petApplicationFieldErrors.email} value={petApplicationForm.email} onChangeText={(value) => {
                            setPetApplicationError(null);
                            clearPetApplicationFieldError('email');
                            setPetApplicationForm((current) => ({ ...current, email: value }));
                          }} />
                        </View>
                        <View style={[styles.clientFormGridItem, clientFullFieldStyle]}>
                          <Field label="Address" required error={petApplicationFieldErrors.address} value={petApplicationForm.address} onChangeText={(value) => {
                            setPetApplicationError(null);
                            clearPetApplicationFieldError('address');
                            setPetApplicationForm((current) => ({ ...current, address: value }));
                          }} />
                        </View>
                        <View style={[styles.clientFormGridItem, clientFullFieldStyle]}>
                          <Field label="Household" required error={petApplicationFieldErrors.household} value={petApplicationForm.household} onChangeText={(value) => {
                            setPetApplicationError(null);
                            clearPetApplicationFieldError('household');
                            setPetApplicationForm((current) => ({ ...current, household: value }));
                          }} />
                        </View>
                        <View style={[styles.clientFormGridItem, clientFullFieldStyle]}>
                          <Field label="Why This Pet" required error={petApplicationFieldErrors.message} value={petApplicationForm.message} multiline onChangeText={(value) => {
                            setPetApplicationError(null);
                            clearPetApplicationFieldError('message');
                            setPetApplicationForm((current) => ({ ...current, message: value }));
                          }} />
                        </View>
                        <View style={[styles.clientFormGridItem, clientFullFieldStyle]}>
                          <View style={styles.field}>
                            <View style={styles.fieldLabelRow}>
                              <Text style={styles.fieldLabel}>Supporting Documents</Text>
                              <Text style={styles.fieldLabelRequired}>Required</Text>
                            </View>
                            <View style={[styles.petApplicationUploadCard, petApplicationFieldErrors.documents && styles.petApplicationUploadCardError]}>
                              <View style={styles.petApplicationUploadHeader}>
                                <View style={styles.petApplicationUploadIcon}>
                                  <Feather name="paperclip" size={16} color={palette.clayDeep} />
                                </View>
                                <View style={styles.petApplicationUploadCopy}>
                                  <Text style={styles.petApplicationUploadTitle}>Upload files</Text>
                                  <Text style={styles.petApplicationUploadText}>Add IDs, proof of address, or other review documents.</Text>
                                </View>
                              </View>
                              <Pressable style={styles.petApplicationUploadButton} onPress={() => void pickSupportingDocuments()}>
                                <Text style={styles.petApplicationUploadButtonText}>{petApplicationUploads.length > 0 ? 'Add More Files' : 'Choose Files'}</Text>
                              </Pressable>

                              {petApplicationUploads.length > 0 ? (
                                <View style={styles.petApplicationUploadList}>
                                  {petApplicationUploads.map((upload) => (
                                    <View key={upload.uri} style={styles.petApplicationUploadItem}>
                                      <View style={styles.petApplicationUploadItemCopy}>
                                        <Text numberOfLines={1} style={styles.petApplicationUploadItemName}>{upload.name}</Text>
                                        <Text style={styles.petApplicationUploadItemMeta}>{upload.mimeType ?? 'Document'}{typeof upload.size === 'number' ? ` / ${Math.max(1, Math.round(upload.size / 1024))} KB` : ''}</Text>
                                      </View>
                                      <Pressable style={styles.petApplicationUploadRemove} onPress={() => removeSupportingDocument(upload.uri)}>
                                        <Feather name="x" size={14} color={palette.clayDeep} />
                                      </Pressable>
                                    </View>
                                  ))}
                                </View>
                              ) : (
                                <Text style={styles.petApplicationUploadEmpty}>No files selected yet.</Text>
                              )}
                            </View>
                            {petApplicationFieldErrors.documents ? <Text style={styles.fieldErrorText}>{petApplicationFieldErrors.documents}</Text> : null}
                          </View>
                        </View>
                      </View>

                      {petApplicationError ? <Text style={styles.petApplicationErrorText}>{petApplicationError}</Text> : null}
                      <PrimaryButton label={isSubmittingPetApplication ? 'Submitting Application...' : `Submit Application For ${selectedPet.name}`} onPress={submitPetApplication} disabled={isSubmittingPetApplication} />
                    </View>

                    <View style={[styles.petApplicationSidePanel, isTablet && styles.petApplicationSidePanelWide]}>
                      <View style={styles.petApplicationInfoCard}>
                        <Text style={styles.clientSectionLabel}>Before You Submit</Text>
                        <Text style={styles.petApplicationInfoTitle}>Give the team complete context.</Text>
                        <Text style={styles.petApplicationInfoText}>Include the household setup, any existing pets, and the documents you can provide immediately.</Text>
                      </View>

                      <View style={styles.petApplicationChecklistCard}>
                        <View style={styles.petApplicationChecklistItem}>
                          <View style={styles.petApplicationChecklistBadge}>
                            <Text style={styles.petApplicationChecklistBadgeText}>1</Text>
                          </View>
                          <View style={styles.petApplicationChecklistCopy}>
                            <Text style={styles.petApplicationChecklistTitle}>Contact details</Text>
                            <Text style={styles.petApplicationChecklistText}>Use an active phone number and email so the shelter can reach you without delay.</Text>
                          </View>
                        </View>
                        <View style={styles.petApplicationChecklistItem}>
                          <View style={styles.petApplicationChecklistBadge}>
                            <Text style={styles.petApplicationChecklistBadgeText}>2</Text>
                          </View>
                          <View style={styles.petApplicationChecklistCopy}>
                            <Text style={styles.petApplicationChecklistTitle}>Home setup</Text>
                            <Text style={styles.petApplicationChecklistText}>Describe who lives with you and the environment this pet will be moving into.</Text>
                          </View>
                        </View>
                        <View style={styles.petApplicationChecklistItem}>
                          <View style={styles.petApplicationChecklistBadge}>
                            <Text style={styles.petApplicationChecklistBadgeText}>3</Text>
                          </View>
                          <View style={styles.petApplicationChecklistCopy}>
                            <Text style={styles.petApplicationChecklistTitle}>Documents ready</Text>
                            <Text style={styles.petApplicationChecklistText}>List IDs or proof of address you can provide so the review can move faster.</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <Card title="Pet Application" subtitle="Application">
                  <Text style={styles.helper}>Select a pet first to continue with the application.</Text>
                </Card>
              )
            ) : null}
    </>
  );
}

export default function ClientAdoptionRoute() {
  return <ShelterMobileApp initialRoleView="public" initialPublicSection="pet-application" />;
}
