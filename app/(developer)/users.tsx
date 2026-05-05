import { ShelterMobileApp } from '@/components/AppShell';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { UserRole, UserStatus } from '@/types/shelter';
import { Card, DangerButton, Field, PrimaryButton, RolePill } from '@/components';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function DeveloperUsersPage() {
  const {
    store,
    activeRoleView,
    activeDeveloperSection,
    setActiveDeveloperSection,
    setSelectedUserId,
    userRoleDraft,
    setUserRoleDraft,
    userStatusDraft,
    setUserStatusDraft,
    recordWidthStyle,
    canSeeDeveloper,
    selectedManagedUser,
  } = useShelterAppContext();

  return (
    <>
        {activeRoleView === 'developer' && canSeeDeveloper ? (
          <>
            <View style={styles.sectionNav}>
              <RolePill label="Users" active={activeDeveloperSection === 'users'} onPress={() => setActiveDeveloperSection('users')} compact />
            </View>
            {activeDeveloperSection === 'users' ? (
              <Card title="Developer User Management" subtitle="Role, status, and deletion controls with guard rails.">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {store.users.map((user) => (
                    <Pressable key={user.id} style={[styles.record, recordWidthStyle, selectedManagedUser?.id === user.id && styles.recordActive]} onPress={() => {
                      setSelectedUserId(user.id);
                      setUserRoleDraft(user.role);
                      setUserStatusDraft(user.status);
                    }}>
                      <Text style={styles.recordTitle}>{user.name}</Text>
                      <Text style={styles.recordMeta}>{user.role} | {user.status}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                {selectedManagedUser ? (
                  <>
                    <Text style={styles.panelTitle}>{selectedManagedUser.name}</Text>
                    <Text style={styles.helper}>{selectedManagedUser.email}</Text>
                    <Field label="Role" value={userRoleDraft} onChangeText={(value) => setUserRoleDraft(value as UserRole)} />
                    <Field label="Status" value={userStatusDraft} onChangeText={(value) => setUserStatusDraft(value as UserStatus)} />
                    <PrimaryButton label="Update Role and Status" onPress={() => store.updateUserRoleStatus(selectedManagedUser.id, userRoleDraft, userStatusDraft)} />
                    <DangerButton label="Delete User" onPress={() => store.deleteUser(selectedManagedUser.id)} />
                    <Text style={styles.helper}>The store blocks self-edit, self-delete, and removing the last developer account.</Text>
                  </>
                ) : null}
              </Card>
            ) : null}
          </>
        ) : null}
    </>
  );
}

export default function DeveloperUsersRoute() {
  return <ShelterMobileApp initialRoleView="developer" initialDeveloperSection="users" />;
}
