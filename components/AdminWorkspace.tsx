import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/constants/premium-theme';
import { AdminAdoptionsPage } from '@/app/(admin)/adoption-requests';
import { AdminDashboardPage } from '@/app/(admin)/dashboard';
import { AdminDonationDetailsPage } from '@/app/(admin)/donation-details';
import { AdminDonationsPage } from '@/app/(admin)/donations';
import { AdminHealthPage } from '@/app/(admin)/health-monitoring';
import { AdminHealthRecordPage } from '@/app/(admin)/vaccination-schedule';
import { AdminPetsPage } from '@/app/(admin)/manage-pets';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminWorkspace() {
  const { activeAdminMeta, activeAdminSection, adminNotificationCount, isAdminSidebarOpen, openAdminSidebar, store } = useShelterAppContext();

  return (
    <View style={styles.adminWorkspace}>
      {!isAdminSidebarOpen ? (
        <View style={styles.adminDashboardTopBar}>
          <Pressable style={styles.adminDashboardIconButton} onPress={openAdminSidebar}>
            <Feather name="menu" size={18} color={palette.ink} />
          </Pressable>
          <Pressable style={styles.adminDashboardIconButton} onPress={() => void store.clearNotifications().catch(() => undefined)}>
            <Feather name="bell" size={18} color={palette.ink} />
            {adminNotificationCount > 0 ? (
              <View style={styles.adminDashboardNotificationBadge}>
                <Text style={styles.adminDashboardNotificationBadgeText}>{adminNotificationCount > 9 ? '9+' : String(adminNotificationCount)}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      ) : null}

      <AdminDashboardPage />
      {activeAdminSection !== 'dashboard' && activeAdminSection !== 'pets' ? (
        <View style={styles.adminSectionHeaderCard}>
          <Text style={styles.adminSectionHeaderTitle}>{activeAdminMeta.label}</Text>
          <Text style={styles.adminSectionHeaderText}>{activeAdminMeta.subtitle}</Text>
        </View>
      ) : null}
      <AdminPetsPage />
      <AdminAdoptionsPage />
      <AdminDonationsPage />
      <AdminDonationDetailsPage />
      <AdminHealthPage />
      <AdminHealthRecordPage />
    </View>
  );
}
