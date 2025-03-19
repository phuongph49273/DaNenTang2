import React, { FC, memo, useState } from 'react';
import { View, TextInput, Button, StyleSheet, ToastAndroid } from 'react-native';

type UserType = {
    name: string;
    avatar: string;
};

type BodyType = {
    onUpdateInfor: (user: UserType) => void;
    onClickChangeBgFooter: () => void;
};

const Body: FC<BodyType> = memo(({ onUpdateInfor, onClickChangeBgFooter }) => {
    const [name, setName] = useState('');
    const [linkImage, setLinkImage] = useState('');

    const handleChangeInfo = () => {
        if (name.trim().length > 0 && linkImage.trim().length > 0) {
            onUpdateInfor({ name, avatar: linkImage });
        } else {
            ToastAndroid.show('Không được để trống!', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nhập tên..."
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Nhập link ảnh..."
                value={linkImage}
                onChangeText={setLinkImage}
            />
            <Button title="Cập nhật thông tin" onPress={handleChangeInfo} />
            <Button title="Đổi màu footer" onPress={onClickChangeBgFooter} color="green" />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 16,
        height: "75%",
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});
export default Body