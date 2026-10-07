LEADER_IP=$(nslookup -q=A $HEADLESS_SVC_NAME | awk '/Address: / {print $2}' | sort -V | head -n 1)
echo $LEADER_IP $POD_IP
if [ $LEADER_IP = $POD_IP ]; then
    echo "Leader container"
    exit 0
else
    echo "NOT leader container"
    exit 1
fi
