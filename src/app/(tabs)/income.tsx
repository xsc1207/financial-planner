import OverallMonthIncomeCard from '@/components/OverallMonthIncomeCard';
import RecentIncomeItems from '@/components/RecentMonthIncomeItems';
import { Income, deleteIncome, getIncome } from '@/storage/income';
import { colors, globalStyles } from '@/styles/global';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function IncomeScreen() {
  const [income, setIncome] = useState<Income[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const loadIncome = async () => {
    const data = await getIncome();
    setIncome(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadIncome();
    }, [])
  );

  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  const goToPreviousYear = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    });
  };

  const goToNextYear = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  };

  const selectMonth = (monthIndex: number) => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });

    setShowMonthPicker(false);
  };

  const selectedMonthIncome = income.filter((item) => {
    if (!item.date) return false;

    const incomeDate = new Date(item.date);

    return (
      incomeDate.getMonth() === selectedMonth.getMonth() &&
      incomeDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const selectedMonthIncomeTotal = selectedMonthIncome.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const handleDeleteIncome = async (id: string) => {
    await deleteIncome(id);
    loadIncome();
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Income</Text>

        <TouchableOpacity onPress={() => router.push('/add-income')}>
          <Text style={styles.addButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.monthSelector}>
              <TouchableOpacity
                onPress={goToPreviousMonth}
                style={styles.monthButton}
              >
                <Text style={styles.monthArrow}>‹</Text>
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
                <Text style={styles.monthText}>
                  {selectedMonth.toLocaleDateString('en-GB', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
      
              <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
                <Text style={styles.monthArrow}>›</Text>
              </TouchableOpacity>
            </View>
      

      <OverallMonthIncomeCard
  total={selectedMonthIncomeTotal}
  count={selectedMonthIncome.length}
/>

      <Text style={styles.sectionTitle}>Income Records</Text>

      {selectedMonthIncome.length === 0 ? (
        <Text style={styles.emptyText}>No income for this month</Text>
      ) : (
        selectedMonthIncome.map((income) => (
            <RecentIncomeItems
            key={income.id}
            id={income.id}
            name={income.name}
            value={`${income.value}`}
            date={income.date}
            accountType={income.accountType}
            bankName={income.bankName}
            onDelete={handleDeleteIncome}
          />
        ))
      )}
    
    <Modal visible={showMonthPicker} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <View style={styles.yearHeader}>
                  <TouchableOpacity onPress={goToPreviousYear}>
                    <Text style={styles.yearArrow}>‹</Text>
                  </TouchableOpacity>
    
                  <Text style={styles.yearText}>{selectedMonth.getFullYear()}</Text>
    
                  <TouchableOpacity onPress={goToNextYear}>
                    <Text style={styles.yearArrow}>›</Text>
                  </TouchableOpacity>
                </View>
    
                <View style={styles.monthGrid}>
                  {months.map((month, index) => {
                    const isSelected = selectedMonth.getMonth() === index;
    
                    return (
                      <TouchableOpacity
                        key={month}
                        style={[
                          styles.monthOption,
                          isSelected && styles.monthOptionActive,
                        ]}
                        onPress={() => selectMonth(index)}
                      >
                        <Text
                          style={[
                            styles.monthOptionText,
                            isSelected && styles.monthOptionTextActive,
                          ]}
                        >
                          {month}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
    
                <TouchableOpacity
                  style={styles.modalTodayButton}
                  onPress={() => {
                    goToToday();
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.modalTodayButtonText}>Today</Text>
                </TouchableOpacity>
    
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowMonthPicker(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  monthSelector: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  monthArrow: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 30,
  },
  
  monthText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 150,
    textAlign: 'center',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },

  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
  },

  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  yearArrow: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
    paddingHorizontal: 12,
  },

  yearText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  monthOption: {
    width: '30%',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  monthOptionActive: {
    backgroundColor: colors.primary,
  },

  monthOptionText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  monthOptionTextActive: {
    color: colors.background,
    fontWeight: '700',
  },

  modalTodayButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  modalTodayButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },

  
});