#!/bin/bash

echo "Docker Mongo Kurulumlar"

# User Variable
DOCKER_MONGO="Docker Mongo"


###################################################
# Color
# red=$(tput setaf 1)
# green=$(tput setaf 2)
# yellow=$(tput setaf 3)
# blue=$(tput setaf 4)
# magenta=$(tput setaf 5)
# cyan=$(tput setaf 6)
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

####################################################################################################
#####################################################################################################
# Bashscriptlere İzin Vermemiz
chmod +x bashscript_countdown.sh
ls -al

#####################################################################################################


# Docker Information
docker --version
docker ps
docker search mongo #(OFFICAL)
./bashscript_countdown.sh

# Docker üzerinden mongodb
#####################################################################################################
#####################################################################################################
#####################################################################################################
# Updated
docker_mongo() {
    sleep 2
    echo -e "\n###### ${DOCKER_MONGO} ######  "

    # Geriye Say
    ./bashscript_countdown.sh


    # Güncelleme Tercihi
    echo -e "Güncelleme İçin Seçim Yapınız\n1-)MongoDB\n2-)MongoDB Volume\n3-)Mongo Admin\n4-)Çıkış "
    read chooise

    # Girilen sayıya göre tercih
    case $chooise in
    1)
        echo -e "\e[36m\n###### ${DOCKER_MONGO} ######  \e[0m"
        echo -e "\e[33mDocker Üzerinden MongoDB Yüklemek İster misiniz ? e/h\e[0m"
        read -p "" dockerMongoResult
        if [[ $dockerMongoResult == "e" || $dockerMongoResult == "E" ]]; then
            echo -e "\e[32mDocker Üzerinden MongoDB Yüklenmeye başlandı ...\e[0m"
            # Volume olmadan
            # docker container run --detach --name mongodb-container --publish 27000:27017 mongo
            # docker container run --detach --name mongodb-container --publish 27000:27017 mongo:latest
             docker container run --detach --name mongodb-container --publish 27000:27017 mongo:8.0.4
             ./bashscript_countdown.sh
        else
            echo -e "${RED}MongoDB ekleme yapılmadı${NC}"
        fi
        ;;
    2)
        read -p "Docker Üzerinden MongoDB Admin Yüklemek İstiyor musunuz ? e/h " systemListUpdatedResult
        if [[ $systemListUpdatedResult == "e" || $systemListUpdatedResult == "E" ]]; then
            echo -e "Sistem Paket Güncellenmesi Başladı ..."
            ./bashscript_countdown.sh
             # Username ve Password olarak
             docker container run -d --name mongodb-container  -p 27000:27017 \
             -e MONGO_INITDB_ROOT_USERNAME=admin \
             -e MONGO_INITDB_ROOT_PASSWORD=rootroot \
             mongo
     
             # Shelling
             mongosh
             mongo --host localhost --port 27000 -u admin -p rootroot --authenticationDatabase admin
        else
            echo -e "Sistem Paket Güncellenmesi Yapılmadı... "
        fi
        ;;
    3)
        read -p "Docker ongodb Volume olarak Yüklemek ister misiniz ? e/h " kernelUpdatedResult
        if [[ $kernelUpdatedResult == "e" || $kernelUpdatedResult == "E" ]]; then
            echo -e "Docker Mongodb Volume olarak Yüklemek  ... "

            # Geriye Say
             # Volume Ekleyerek
              docker volume create mongodb_data
              docker container run -d --name mongodb-container  -p 27000:27017 -v mongodb_data:/data/db mongo:8.0.4
        else
            echo -e "Docker Mongodb Volume olarak Yüklemek ... "
        fi
        ;;
    *)
        echo -e "Lütfen sadece size belirtilen seçeneği seçiniz"
        ;;
    esac

     # Docker komutları
    docker ps    # Sadece çalışan containerlerı gösterir
    docker ps -a # Kapatılmış containerıda gösterir
}
docker_mongo


#####################################################################################################
#####################################################################################################
# docker_mongo_terminal
docker_mongo_terminal() {
    sleep 2
    echo -e "\n###### ${LOGOUT} ######  "
    read -p "Docker üzeründen Mongodb terminale Bağlanmak İster misiniz ? e/h " logoutResult
    if [[ $logoutResult == "e" || $logoutResult == "E" ]]; then
        echo -e "Docker mongo_terminal açılıyor ... "

        # Geriye Say
        ./bashscript_countdown.sh

        # Docker komutları
        docker ps    # Sadece çalışan containerlerı gösterir
        docker ps -a # Kapatılmış containerıda gösterir
        #docker stop mongodb-volume-container # Docker ilgili container kapat
        #docker start mongodb-volume-container # Docker ilgili container başlat
        #docker rm mongodb-volume-container # Docker ilgili container sil

        # Docker Terminali
        # docker exec -it mongodb-container  mongosh   # Linux için
        winpty docker exec -it mongodb-container  mongosh # Windows için

        # Mongo Terminalinde
        show dbs; # Mongo Mevcut databaseleri göster
        use blogDB; # Mongo'da blogDB olan database seç
        show dbs; # Mongo Mevcut databaseleri göster
        # db.createCollection("posts");  # Mongo'da byeni Collections oluşturmak
#        db.posts.insertOne({
#            header: "İlk Blog Yazım",
#            content: "Bu benim ilk blog yazımın içeriğidir.",
#            author: "Hamit Mızrak.",
#            tags: "java,jsp",
#        })
        # db.posts.find().pretty(); # Blog yazısını getir
    else
        echo -e "Docker_mongo_terminal Seçilmedi..."
    fi
}
docker_mongo_terminal

