import { colors } from '@/styles/global';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RecentSavingsItemsProps = {
  id: string;
  name: string;
  goalName: string;
  value: string;
  date?: string;
  accountType?: 'cash' | 'bank';
  bankName?: string;
  onDelete: (id: string) => void;
};

export default function RecentSavingsItems({
  id,
  name,
  goalName,
  value,
  date,
  accountType,
  bankName,
  onDelete,
}: RecentSavingsItemsProps) {
  const formatDate = (date?: string) => {
    if (!date) return 'No date';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const accountText =
    accountType === 'bank'
      ? `Bank${bankName ? ` · ${bankName}` : ''}`
      : accountType === 'cash'
        ? 'Cash'
        : '';

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => {
        Alert.alert(
          'Delete Saving',
          `Are you sure you want to delete saving "${name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => onDelete(id),
            },
          ],
        );
      }}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {formatDate(date)} · {goalName}
          {accountText ? ` · ${accountText}` : ''}
        </Text>
      </View>

      <Text style={styles.value} numberOfLines={1}>
        £{value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flex: 1,
    marginRight: 12,
  },

  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  meta: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
  },

  value: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
    maxWidth: 130,
    textAlign: 'right',
  },
});