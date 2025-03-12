import React from 'react';
import { StyleSheet, Image, ScrollView, View, Text, TouchableOpacity } from 'react-native';

// ✅ Custom Section Component
const SectionView = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.titleSection}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
};

// ✅ Event Card Component
const EventCard = ({ data }: { data: any }) => {
  return (
    <View style={styles.card}>
      {data.location && <Text style={styles.label}>Địa điểm</Text>}
      {data.location && <Text style={styles.content}>{data.location}</Text>}

      {data.time && <Text style={styles.label}>Thời gian</Text>}
      {data.time && <Text style={styles.content}>{data.time}</Text>}

      {data.transport && <Text style={styles.label}>Phương tiện di chuyển</Text>}
      {data.transport && <Text style={styles.content}>{data.transport}</Text>}

      {data.duration && <Text style={styles.label}>Thời gian</Text>}
      {data.duration && <Text style={styles.content}>{data.duration}</Text>}

      {data.image && <Image source={{ uri: data.image }} style={styles.image} />}

      {data.hotelName && <Text style={styles.label}>Tên khách sạn</Text>}
      {data.hotelName && <Text style={styles.content}>{data.hotelName}</Text>}

      {data.openHours && <Text style={styles.label}>Giờ mở cửa</Text>}
      {data.openHours && <Text style={styles.content}>{data.openHours}</Text>}

      {data.address && <Text style={styles.content}>{data.address}</Text>}

      {data.hotelName && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>CHI TIẾT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ✅ Data
const eventInfo = [
  {
    title: 'Lịch trình',
    events: [
      {
        location: 'Hồ Tràm, Vũng Tàu',
        time: '09:00 AM - 12:00 AM, 12/12/2024',
        transport: 'Xe bus',
        duration: '21:00 - 22:00',
        image: 'https://www.bambooairways.com/documents/20122/1165110/du-lich-ho-tram-1.jpg/207cbc7c-25d9-b14d-f2b2-0c12f2cb6671?t=1695005085600',
      },
    ],
  },
  {
    title: 'Khách sạn',
    events: [
      {
        hotelName: 'Hồng Quỳnh',
        openHours: '06:00 AM - 12:00 AM',
        address: '234 Quang Trung, Hồ Chí Minh',
      },
    ],
  },
];

// ✅ Main Component
export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      {eventInfo.map((section, index) => (
        <SectionView key={index} title={section.title}>
          {section.events.map((event, idx) => (
            <EventCard key={idx} data={event} />
          ))}
        </SectionView>
      ))}
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginTop: 20
  },
  section: {
    marginBottom: 20,
  },
  titleSection: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionBody: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  card: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#666',
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
