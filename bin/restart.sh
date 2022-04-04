echo ""

/data/SlackBots/Kkumul/bin/stop.sh
echo ""

/data/SlackBots/Kkumul/bin/start.sh
echo ""

echo "=== kkumul process run status check."
ps -ef | grep SlackBots/Kkumul 

echo ""
echo "kkumul restart success."
