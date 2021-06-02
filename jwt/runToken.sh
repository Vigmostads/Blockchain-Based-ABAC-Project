read -p "Key size: " keySize
read -p "Hash size: " hashSize

var0="./gen/"
var1="w"
var2=".txt"

varname="${var0}${keySize}${var1}${hashSize}${var2}"


for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 
do
echo "$i" | node singleTokenGeneration.js >> $varname
#sleep 2
done
echo "Saved results to file: $varname"