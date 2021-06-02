#uses the verification function repeatedly with a file that contains keys used in populating the blockchain and writes the time to complete to a file.
a=0
b=0
key=""
filename='10000x256ECPubKeyArray.txt'

Search()
{
	time peer chaincode query -C mychannel -n ledger -c '{"Args":["Verification", "{\"selector\":{\"PublicKey\":\"'$key'\", \"Attribute\":\"'$b'\"}}"]}' ; } 2>>verificattiontime750.txt


while read line;
do
	if [ $a -le 400 ]
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
						Search
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
	

