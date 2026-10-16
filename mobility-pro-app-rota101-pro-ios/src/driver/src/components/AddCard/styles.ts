import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 20,
    marginTop: 60,
  },
  cardHolder: {
    color: 'white',
    fontSize: 16,
    left: 10,
  },
  cardCvvLabel: {
    color: 'white',
    fontSize: 14,
    left: 10,
    marginRight: 15,
  },
  cardCvv: {
    color: 'white',
    fontSize: 16,
  },
  cardDueDate: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  cardFlagText: {
    color: 'white',
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  cardHolderCvvWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardCvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cardExpiry: {
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexGrow: 1,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 10,
  },
  confirmButton: {},
  buttonText: {
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'red',
  },
  confirmButtonText: {
    color: 'blue',
  },
  cardIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  placeholder: {
    opacity: 0.5,
  },
});

export const CardMock = styled.View`
  background-color: #000;
  height: 200px;
  border-radius: 18px;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  align-items: center;
`;

export const CardIconWrapper = styled.View`
  position: absolute;
  top: 20px;
  right: 15px;
`;

export const CardIconTextWrapper = styled.View`
  position: absolute;
  top: 10px;
  left: 15px;
`;

export const CardInfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const Group = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SubGroup = styled.View`
  width: 45%;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;
