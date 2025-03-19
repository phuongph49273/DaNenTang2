import React, { FC, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type FooterType = {
    timeUpdate: string;
    backgroundColor: string;
};

const Footer: FC<FooterType> = memo(({ timeUpdate, backgroundColor }) => {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.text}>Thời gian bạn cập nhật thông tin: {timeUpdate}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderTopWidth: 1, 
        borderColor: '#ddd',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
});
export default Footer