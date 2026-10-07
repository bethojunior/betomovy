

FROM node:18.16.0

# Define o diretório de trabalho no Docker
WORKDIR /app

# Instala pacotes essenciais
RUN apt-get update && apt-get install -y git wget curl unzip ruby ruby-dev build-essential

# Instala OpenJDK 11
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get clean

# Define as variáveis de ambiente para Java
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-arm64

# Adiciona o repositório de pacotes do Android SDK
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -

# Instala o Android SDK
RUN mkdir -p /usr/lib/android-sdk/cmdline-tools && \
    cd /usr/lib/android-sdk/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip -O cmdline-tools.zip && \
    unzip cmdline-tools.zip && \
    rm cmdline-tools.zip && \
    mv cmdline-tools latest

# Define a variável de ambiente para Android SDK
ENV ANDROID_HOME /usr/lib/android-sdk
ENV ANDROID_SDK_ROOT /usr/lib/android-sdk


# Adiciona o diretório de ferramentas do Android SDK ao PATH
ENV PATH $PATH:$ANDROID_HOME/tools

# Adiciona o diretório de plataforma do Android SDK ao PATH
ENV PATH $PATH:$ANDROID_HOME/platform-tools

# Copia os arquivos de dependências para o diretório de trabalho
COPY package*.json ./

# Instala expo-cli e eas-cli globalmente no ambiente docker
RUN npm install -g expo-cli 
RUN npm install -g eas-cli

# Instala as dependências do projeto
RUN yarn

# Cria o diretório 'android'
RUN mkdir -p android


# Cria o arquivo local.properties para especificar a localização do SDK do Android
RUN echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Expõe a porta 19000 do expo e 19001 para o serviço de desenvolvimento
EXPOSE 19000
EXPOSE 19001

CMD ["yarn", "start"]

# CMD echo "Digite 'dev' ou 'prod': " && \
#     read -r choice && \
#     if [ "$choice" = "dev" ]; then \
#         yarn android-build:dev; \
#     elif [ "$choice" = "prod" ]; then \
#         yarn android-build:prod; \
#     else \
#         echo "Escolha inválida!"; \
#         exit 1; \
#     fi



    #COMANDO PARA ACEITAR AS LICENCAS yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
