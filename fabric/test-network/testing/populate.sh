#Uses keys from a file along with time and random or predetermined variables for each transactions part, and writes the time to complete to a file.
a=1
b=0
now=""
filename='10000x256ECPubKeyArray.txt'
key=""

create()
{
	time peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n ledger -c '{"Args":["CreateAssignment","transaction'$a'","'$key'","'$b'","'$now'","iohweg08yoih2388hq3ia9gg"]}' ; } 2>>poptime1000.txt


while read line;
do
	if [ $a -le 1000 ] 
	then
		if [ "$line" != "" ]
		then	
			if [ "$line" != "-----BEGIN PUBLIC KEY-----" ]
			then
				if [ "$line" != "-----END PUBLIC KEY-----" ]
				then
					key="$key$line"
				else 
					while [ $b -le 10 ] 
					do
						now=$(date "+%s")
						create 
						a=`expr $a + 1`
						b=`expr $b + 1`
					done 
					b=`expr $b = 0`
					key=""
				fi
			fi
		fi
	fi
done < "$filename"
	
