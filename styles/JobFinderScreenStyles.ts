import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderRadius: 8,
  marginBottom: 15,
  paddingHorizontal: 10,
},
searchIcon: {
  marginRight: 8,
},
searchBar: {
  flex: 1,
  height: 40,
  padding: 0,
  borderWidth: 0,
},
clearButton: {
  padding: 5,
},
  jobCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 20,
    align: 'center',
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 14,
    align: 'center',
    color: 'gray',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
  },
  themeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  themeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
