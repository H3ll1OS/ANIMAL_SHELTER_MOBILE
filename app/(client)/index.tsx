import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { SpeciesFilter } from '@/types/navigation';
import { ClientPetBrowseCard } from '@/components';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientHomePage() {
  const {
    activePublicSection,
    setActivePublicSection,
    speciesFilter,
    setSpeciesFilter,
    favoritePetIds,
    isShortScreen,
    isTablet,
    useClientPetGrid,
    useCompactHomePreview,
    homePetCardWidthStyle,
    selectedPet,
    homePreviewPets,
    clientDisplayName,
    availablePetsCount,
    pendingClientApplications,
    approvedClientApplications,
    openPetDetails,
    toggleFavoritePet,
  } = useShelterAppContext();

  return (
    <>
            {activePublicSection === 'home' ? (
              <View style={styles.clientHomeStack}>
                <View style={[styles.clientHomeHero, isTablet && styles.clientHomeHeroWide, isShortScreen && styles.clientHomeHeroCompact]}>
                  <View style={styles.clientHomeHeroTopRow}>
                    <View style={styles.clientHomeHeroCopy}>
                      <Text style={styles.clientHomeEyebrow}>Welcome back</Text>
                      <Text style={[styles.clientHomeTitle, isShortScreen && styles.clientHomeTitleCompact]}>Find your next companion.</Text>
                      <Text style={[styles.clientHomeText, isShortScreen && styles.clientHomeTextCompact]}>
                        Hi {clientDisplayName}, explore adoptable pets, follow your requests, and support the shelter from one clean mobile experience.
                      </Text>
                    </View>
                    <View style={styles.clientHomeHeroActions}>
                      <Pressable style={styles.clientHomeHeroIconButton} onPress={() => setActivePublicSection('donations')}>
                        <Feather name="gift" size={16} color="#ffffff" />
                      </Pressable>
                      <Pressable style={styles.clientHomeHeroIconButton} onPress={() => setActivePublicSection('account')}>
                        <Feather name="bell" size={16} color="#ffffff" />
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.clientHomeHeroStats}>
                    <View style={[styles.clientHomeHeroStatCard, isShortScreen && styles.clientHomeHeroStatCardCompact]}>
                      <Text style={styles.clientHomeHeroStatLabel}>Available</Text>
                      <Text style={[styles.clientHomeHeroStatValue, isShortScreen && styles.clientHomeHeroStatValueCompact]}>{availablePetsCount}</Text>
                    </View>
                    <View style={[styles.clientHomeHeroStatCard, isShortScreen && styles.clientHomeHeroStatCardCompact]}>
                      <Text style={styles.clientHomeHeroStatLabel}>In Review</Text>
                      <Text style={[styles.clientHomeHeroStatValue, isShortScreen && styles.clientHomeHeroStatValueCompact]}>{pendingClientApplications}</Text>
                    </View>
                    <View style={[styles.clientHomeHeroStatCard, isShortScreen && styles.clientHomeHeroStatCardCompact]}>
                      <Text style={styles.clientHomeHeroStatLabel}>Approved</Text>
                      <Text style={[styles.clientHomeHeroStatValue, isShortScreen && styles.clientHomeHeroStatValueCompact]}>{approvedClientApplications}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.clientHomeFilterBar, isShortScreen && styles.clientHomeFilterBarCompact]}>
                  {(['all', 'Dog', 'Cat'] as SpeciesFilter[]).map((filter) => (
                    <Pressable
                      key={filter}
                      style={[styles.clientHomeFilterChip, speciesFilter === filter && styles.clientHomeFilterChipActive]}
                      onPress={() => setSpeciesFilter(filter)}>
                      <Text style={[styles.clientHomeFilterChipText, speciesFilter === filter && styles.clientHomeFilterChipTextActive]}>{filter}</Text>
                    </Pressable>
                  ))}
                  <Pressable style={styles.clientHomeGhostButton} onPress={() => setActivePublicSection('pets')}>
                    <Text style={styles.clientHomeGhostButtonText}>See All</Text>
                  </Pressable>
                </View>

                <View style={[styles.clientHomeBrowseSection, isShortScreen && styles.clientHomeBrowseSectionCompact]}>
                  <View style={styles.clientHomeSectionHeader}>
                    <View>
                      <Text style={styles.clientSectionLabel}>Top matches</Text>
                      <Text style={styles.clientHomeSectionText}>A premium shortlist of pets ready to meet you.</Text>
                    </View>
                    <Pressable style={styles.clientHomeInlineAction} onPress={() => setActivePublicSection('pets')}>
                      <Text style={styles.clientHomeInlineActionText}>Browse all pets</Text>
                    </Pressable>
                  </View>
                  {useClientPetGrid ? (
                    <View style={styles.clientPetGrid}>
                      {homePreviewPets.map((pet) => (
                        <ClientPetBrowseCard key={pet.id} pet={pet} active={selectedPet?.id === pet.id} isFavorite={favoritePetIds.includes(pet.id)} onToggleFavorite={() => toggleFavoritePet(pet.id)} widthStyle={homePetCardWidthStyle} variant="home" onPress={() => {
                          openPetDetails(pet.id, 'home');
                        }} />
                      ))}
                    </View>
                  ) : useCompactHomePreview ? (
                    <View style={styles.clientHomeSingleCardWrap}>
                      {homePreviewPets.map((pet) => (
                        <ClientPetBrowseCard key={pet.id} pet={pet} active={selectedPet?.id === pet.id} isFavorite={favoritePetIds.includes(pet.id)} onToggleFavorite={() => toggleFavoritePet(pet.id)} widthStyle={homePetCardWidthStyle} variant="home" onPress={() => {
                          openPetDetails(pet.id, 'home');
                        }} />
                      ))}
                    </View>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clientPetRail}>
                      {homePreviewPets.map((pet) => (
                        <ClientPetBrowseCard key={pet.id} pet={pet} active={selectedPet?.id === pet.id} isFavorite={favoritePetIds.includes(pet.id)} onToggleFavorite={() => toggleFavoritePet(pet.id)} widthStyle={homePetCardWidthStyle} variant="home" onPress={() => {
                          openPetDetails(pet.id, 'home');
                        }} />
                      ))}
                    </ScrollView>
                  )}
                  {homePreviewPets.length === 0 ? (
                    <View style={styles.clientInfoBox}>
                      <Text style={styles.clientInfoTitle}>No pets found</Text>
                      <Text style={styles.clientInfoText}>Try another species filter or come back once new pets are available.</Text>
                    </View>
                  ) : null}
                </View>

              </View>
            ) : null}
    </>
  );
}

export default function ClientHomeRoute() {
  return <ShelterMobileApp initialRoleView="public" initialPublicSection="home" />;
}
