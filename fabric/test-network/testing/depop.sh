#Invokes the function that deletes from world state, revoking the assignments on the blockchain. 
a=2


while [ $a -le 600 ] 
do
	{ time peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n ledger -c '{"Args":["DeleteAssignment","transaction'$a'"]}' ; } 2>> depoptime750.txt
	a=`expr $a + 4` 
done

