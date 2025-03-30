import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/SavedJobsScreenStyles';
import { Job } from './JobFinderScreen';
import ApplyModal from '../components/ApplyModal';

export default function SavedJobsScreen() {
  const { theme } = useTheme();
  const { savedJobs, removeJob } = useSavedJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalVisible, setApplyModalVisible] = useState(false);

  return (
    <View style={{ ...styles.container, backgroundColor: theme.background }}>
      {savedJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={50} color={theme.text} />
          <Text style={{ ...styles.emptyStateText, color: theme.text }}>
            No saved jobs yet. Save jobs to view them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                ...styles.jobCard,
                backgroundColor: theme.modalBackground,
              }}>
              <View style={styles.jobCardHeader}>
                <View style={styles.jobInfo}>
                  <Text style={{ ...styles.jobTitle, color: theme.text }}>
                    {item.title}
                  </Text>
                  <Text style={{ ...styles.companyName, color: theme.text }}>
                    {item.companyName}
                  </Text>

                  {item.location && (
                    <View style={styles.jobDetailItem}>
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={theme.text}
                      />
                      <Text
                        style={{ ...styles.jobDetailText, color: theme.text }}>
                        {item.location}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                {/* Apply Button */}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedJob(item);
                    setApplyModalVisible(true);
                  }}
                  style={[styles.applyButton, { backgroundColor: '#28A745' }]}
                >
                  <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
                  <Text color="#FFFFFF" style={styles.buttonText}>Apply Now</Text>
                </TouchableOpacity>

                {/* Remove Job Button */}
                <TouchableOpacity
                  onPress={() => removeJob(item.id)}
                  style={{
                    ...styles.removeButton,
                    backgroundColor: theme.buttonBackground,
                  }}>
                  <Ionicons name="trash-outline" size={18} color={theme.buttonText} />
                  <Text style={{ color: theme.buttonText, marginLeft: 5 }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* ApplyModal Component */}
      <ApplyModal
        visible={applyModalVisible}
        onClose={() => setApplyModalVisible(false)}
        job={selectedJob}
      />
    </View>
  );
}