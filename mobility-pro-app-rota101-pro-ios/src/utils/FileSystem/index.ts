import RNFS from 'react-native-fs';

class FileSystemLocal {
  static documentDirectory = RNFS.ExternalStorageDirectoryPath + '/Documents/';

  async findFolders() {
    try {
      return RNFS.readdir(FileSystemLocal.documentDirectory)
        .then(result => {
          return result || [];
        })
        .catch(err => {
          return [];
        });
    } catch (error) {
      return [];
    }
  }
}

export default FileSystemLocal;
