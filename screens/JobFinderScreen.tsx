import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSavedJobs } from '../context/SavedJobsContext';
import styles from '../styles/JobFinderScreenStyles';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';

// Define Job Interface
export interface Job {
  id: string;
  title: string;
  companyName?: string;
  companyLogo?: string;
  location?: string;
  description?: string;
  minSalary?: string;
  maxSalary?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  expiryDate?: string;
  applicationLink?: string;
}

// API Endpoint
const API_URL = 'https://empllo.com/api/v1';

const JobFinderScreen = () => {
  const { theme } = useTheme();
  const { savedJobs, saveJob } = useSavedJobs();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch Jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.jobs))
          throw new Error('Invalid API response format');

        const jobsWithIds = data.jobs.map((job: Job) => ({
          ...job,
          id: job.id || uuid.v4().toString(), // Assign a unique ID if missing
        }));

        setJobs(jobsWithIds);
      } catch (error: any) {
        console.error('Error fetching jobs:', error.message);
        Alert.alert('Error', error.message);
        // Load dummy data for testing
        setJobs([
          {
            id: '1',
            title: 'Senior React Developer',
            companyName: 'TechCorp',
            location: 'Remote',
            description:
              'Looking for an experienced React developer to join our team',
            minSalary: '100000',
            maxSalary: '150000',
            jobType: 'Full-time',
            workModel: 'Remote',
            seniorityLevel: 'Senior',
            expiryDate: '2025-04-30',
            applicationLink: 'https://example.com/apply',
          },
          {
            id: '2',
            title: 'UX Designer',
            companyName: 'DesignHub',
            location: 'New York, NY',
            description: 'Join our creative team as a UX Designer',
            minSalary: '90000',
            maxSalary: '120000',
            jobType: 'Full-time',
            workModel: 'Hybrid',
            seniorityLevel: 'Mid-level',
            expiryDate: '2025-05-15',
            applicationLink: 'https://example.com/apply',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply Job Function
  const applyJob = (job: Job) => {
    if (job.applicationLink) {
      Linking.openURL(job.applicationLink);
    } else {
      Alert.alert('Application Unavailable', 'No application link provided.');
    }
  };

  // Filter Jobs Based on Search
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.companyName &&
        job.companyName.toLowerCase().includes(search.toLowerCase())) ||
      (job.location &&
        job.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Render job card
  const renderJobCard = ({ item }: { item: Job }) => {
    const isJobSaved = savedJobs.some((saved) => saved.id === item.id);

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedJob(item);
          setModalVisible(true);
        }}
        style={[styles.jobCard, { backgroundColor: theme.modalBackground }]}>
        <View style={styles.jobHeader}>
          {item.companyLogo ? (
            <Image
              source={{ uri: item.companyLogo }}
              style={styles.logo}
              defaultSource={require('../assets/icon.png')} // Fallback image
            />
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: theme.buttonBackground },
              ]}>
              <Text style={{ color: theme.buttonText, fontSize: 16 }}>
                {item.companyName ? item.companyName.charAt(0) : 'J'}
              </Text>
            </View>
          )}
          <View style={styles.jobHeaderText}>
            <Text style={[styles.jobTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.companyName, { color: theme.text }]}>
              {item.companyName}
            </Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          {item.location && (
            <View style={styles.jobDetailItem}>
              <Ionicons name="location-outline" size={16} color={theme.text} />
              <Text style={[styles.jobDetailText, { color: theme.text }]}>
                {item.location}
              </Text>
            </View>
          )}

          {(item.minSalary || item.maxSalary) && (
            <View style={styles.jobDetailItem}>
              <Ionicons name="cash-outline" size={16} color={theme.text} />
              <Text style={[styles.jobDetailText, { color: theme.text }]}>
                ${item.minSalary} - ${item.maxSalary}
              </Text>
            </View>
          )}

          {item.jobType && (
            <View style={styles.jobDetailItem}>
              <Ionicons name="time-outline" size={16} color={theme.text} />
              <Text style={[styles.jobDetailText, { color: theme.text }]}>
                {item.jobType}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => saveJob(item)}
          style={[
            styles.saveButton,
            {
              backgroundColor: isJobSaved ? '#28A745' : theme.buttonBackground,
            },
          ]}>
          <Ionicons
            name={isJobSaved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={theme.buttonText}
          />
          <Text style={{ color: theme.buttonText, marginLeft: 5 }}>
            {isJobSaved ? 'Saved' : 'Save Job'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

const searchInputRef = React.useRef<TextInput>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => {
            // Focus on the text input when icon is pressed
            if (searchInputRef.current) searchInputRef.current.focus();
          }}>
          <Ionicons
            name="search"
            size={20}
            color={theme.text}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
    
        <TextInput
          ref={searchInputRef}
          style={[
            styles.searchBar,
            { color: theme.text, borderColor: theme.text },
          ]}
          placeholder="Search jobs, companies, locations..."
          placeholderTextColor={theme.text}
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.text}
          style={styles.loadingIndicator}
        />
      ) : filteredJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={50} color={theme.text} />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No jobs found matching your search.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View
            style={[
              styles.modalOverlay,
              { backgroundColor: 'rgba(0,0,0,0.5)' },
            ]}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.modalBackground },
              ]}>
              <ScrollView style={styles.modalContent}>
                {/* Job Header */}
                <View style={styles.modalHeader}>
                  {selectedJob.companyLogo ? (
                    <Image
                      source={{ uri: selectedJob.companyLogo }}
                      style={styles.modalLogo}
                      defaultSource={require('../assets/icon.png')}
                    />
                  ) : (
                    <View
                      style={[
                        styles.modalLogoPlaceholder,
                        { backgroundColor: theme.buttonBackground },
                      ]}>
                      <Text style={{ color: theme.buttonText, fontSize: 24 }}>
                        {selectedJob.companyName
                          ? selectedJob.companyName.charAt(0)
                          : 'J'}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.jobDetailsTitle, { color: theme.text }]}>
                    {selectedJob.title}
                  </Text>
                  <Text
                    style={[styles.jobDetailsCompany, { color: theme.text }]}>
                    {selectedJob.companyName}
                  </Text>
                </View>

                {/* Job Details */}
                <View style={styles.detailsContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Job Details
                  </Text>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Location: {selectedJob.location || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="cash-outline"
                      size={18}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Salary: ${selectedJob.minSalary} - $
                      {selectedJob.maxSalary}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="briefcase-outline"
                      size={18}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Job Type: {selectedJob.jobType}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="home-outline"
                      size={18}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Work Model: {selectedJob.workModel}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="trending-up-outline"
                      size={18}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Seniority: {selectedJob.seniorityLevel}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Expires: {selectedJob.expiryDate}
                    </Text>
                  </View>
                </View>

                {/* Job Description */}
                <View style={styles.descriptionContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Description
                  </Text>
                  <Text style={[styles.description, { color: theme.text }]}>
                    {selectedJob.description || 'No description provided.'}
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  {/* Apply Button */}
                  <TouchableOpacity
                    onPress={() => applyJob(selectedJob)}
                    style={[
                      styles.applyButton,
                      { backgroundColor: '#28A745' },
                    ]}>
                    <Ionicons
                      name="paper-plane-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>Apply Now</Text>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={() => saveJob(selectedJob)}
                    style={[
                      styles.modalSaveButton,
                      { backgroundColor: theme.buttonBackground },
                    ]}>
                    <Ionicons
                      name={
                        savedJobs.some((job) => job.id === selectedJob.id)
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}>
                  <Text style={{ color: theme.text }}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default JobFinderScreen;
