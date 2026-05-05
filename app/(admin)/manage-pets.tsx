import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import type { Pet, PetStatus } from '@/types/shelter';
import { AdminPetDirectoryItem, DangerButton, Field, PrimaryButton } from '@/components';
import { makePetForm, petPayloadFromForm } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminPetsPage() {
  const {
    store,
    activeAdminSection,
    adminPetSearchTerm,
    setAdminPetSearchTerm,
    adminPetStatusFilter,
    setAdminPetStatusFilter,
    petForm,
    setPetForm,
    petEditId,
    setPetEditId,
    adminPetStatusCounts,
    adminFilteredPets,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'pets' ? (
              <View style={styles.adminPetDirectoryScreen}>
                <View style={styles.adminPetDirectoryHeader}>
                  <View style={styles.adminPetDirectoryHeaderCopy}>
                    <Text style={styles.adminPetDirectoryTitle}>Pets</Text>
                    <Text style={styles.adminPetDirectorySubtitle}>Manage shelter records with one compact workspace.</Text>
                  </View>
                  <Pressable style={styles.adminPetDirectoryActionButton} onPress={() => {
                    setPetEditId(null);
                    setPetForm(makePetForm());
                  }}>
                    <Feather name="plus" size={18} color="#ffffff" />
                  </Pressable>
                </View>

                <View style={styles.adminPetDirectorySearchRow}>
                  <View style={styles.adminPetDirectorySearchBox}>
                    <Feather name="search" size={16} color="#94a3b8" />
                    <TextInput
                      nativeID="admin-pet-search"
                      value={adminPetSearchTerm}
                      onChangeText={setAdminPetSearchTerm}
                      style={styles.adminPetDirectorySearchInput}
                      placeholder="Search pets..."
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <Pressable
                    style={[styles.adminPetDirectoryFilterButton, (adminPetStatusFilter !== 'all' || adminPetSearchTerm) && styles.adminPetDirectoryFilterButtonActive]}
                    onPress={() => {
                      setAdminPetStatusFilter('all');
                      setAdminPetSearchTerm('');
                    }}>
                    <Feather name="sliders" size={16} color={adminPetStatusFilter !== 'all' || adminPetSearchTerm ? palette.clayDeep : '#94a3b8'} />
                  </Pressable>
                </View>

                <View style={styles.adminPetDirectoryChipRow}>
                  {([
                    { key: 'all', label: 'All', count: adminPetStatusCounts.all },
                    { key: 'Available', label: 'Available', count: adminPetStatusCounts.Available },
                    { key: 'Adopted', label: 'Adopted', count: adminPetStatusCounts.Adopted },
                  ] as const).map((filter) => (
                    <Pressable
                      key={filter.key}
                      style={[styles.adminPetDirectoryChip, adminPetStatusFilter === filter.key && styles.adminPetDirectoryChipActive]}
                      onPress={() => setAdminPetStatusFilter(filter.key)}>
                      <Text style={[styles.adminPetDirectoryChipText, adminPetStatusFilter === filter.key && styles.adminPetDirectoryChipTextActive]}>
                        {filter.label} ({filter.count})
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.adminPetDirectoryList}>
                  {adminFilteredPets.map((pet) => (
                    <AdminPetDirectoryItem
                      key={pet.id}
                      pet={pet}
                      active={petEditId === pet.id}
                      onPress={() => {
                        setPetEditId(pet.id);
                        setPetForm(makePetForm(pet));
                      }}
                    />
                  ))}
                  {adminFilteredPets.length === 0 ? (
                    <View style={styles.adminPetDirectoryEmptyState}>
                      <Text style={styles.clientInfoTitle}>No pets match this search</Text>
                      <Text style={styles.clientInfoText}>Try a broader keyword or switch the active status filter.</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.adminPetEditorCard}>
                  <View style={styles.adminPetEditorHeader}>
                    <View>
                      <Text style={styles.adminPetEditorTitle}>{petEditId ? 'Edit Pet' : 'Add New Pet'}</Text>
                      <Text style={styles.adminPetEditorText}>{petEditId ? 'Update the selected pet record.' : 'Create a new shelter pet profile.'}</Text>
                    </View>
                    {petEditId ? (
                      <Pressable style={styles.adminPetEditorResetButton} onPress={() => {
                        setPetEditId(null);
                        setPetForm(makePetForm());
                      }}>
                        <Text style={styles.adminPetEditorResetButtonText}>New</Text>
                      </Pressable>
                    ) : null}
                  </View>
                  <Field label="Name" value={petForm.name} onChangeText={(value) => setPetForm((current) => ({ ...current, name: value }))} />
                  <Field label="Species" value={petForm.species} onChangeText={(value) => setPetForm((current) => ({ ...current, species: value }))} />
                  <Field label="Breed" value={petForm.breed} onChangeText={(value) => setPetForm((current) => ({ ...current, breed: value }))} />
                  <Field label="Age" value={petForm.age} onChangeText={(value) => setPetForm((current) => ({ ...current, age: value }))} />
                  <Field label="Gender" value={petForm.gender} onChangeText={(value) => setPetForm((current) => ({ ...current, gender: value as Pet['gender'] }))} />
                  <Field label="Status" value={petForm.status} onChangeText={(value) => setPetForm((current) => ({ ...current, status: value as PetStatus }))} />
                  <Field label="Date Received" value={petForm.dateReceived} onChangeText={(value) => setPetForm((current) => ({ ...current, dateReceived: value }))} />
                  <Field label="Size" value={petForm.size} onChangeText={(value) => setPetForm((current) => ({ ...current, size: value as Pet['size'] }))} />
                  <Field label="Image Label" value={petForm.imageLabel} onChangeText={(value) => setPetForm((current) => ({ ...current, imageLabel: value }))} />
                  <Field label="Description" value={petForm.description} multiline onChangeText={(value) => setPetForm((current) => ({ ...current, description: value }))} />
                  <PrimaryButton label={petEditId ? 'Update Pet' : 'Create Pet'} onPress={async () => {
                    const payload = petPayloadFromForm(petForm);
                    if (petEditId) await store.updatePet(petEditId, payload); else await store.addPet(payload);
                    setPetEditId(null);
                    setPetForm(makePetForm());
                  }} />
                  {petEditId ? <DangerButton label="Delete Pet" onPress={async () => {
                    await store.deletePet(petEditId);
                    setPetEditId(null);
                    setPetForm(makePetForm());
                  }} /> : null}
                </View>
              </View>
            ) : null}
    </>
  );
}

export default function AdminManagePetsRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="pets" />;
}
