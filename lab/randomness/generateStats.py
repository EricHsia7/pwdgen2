import string
import secrets
import csv
import numpy as np

padding_spaces = "                 "

def generate_password(length=16):
    characters = string.ascii_letters + string.digits + string.punctuation
    list = [secrets.choice(characters) for _ in range(length)]
    return list

def generate_sorted_password(length=16):
    characters = string.ascii_letters + string.digits + string.punctuation
    list = [secrets.choice(characters) for _ in range(length)]
    sorted_list = sorted(list, key=lambda s: 1 / ord(s[0]))
    return sorted_list

def calculateAverageMovedDistance(arr):
    arr_len = len(arr)
    distance = 0
    n_arr = []
    json = {}
    t = []
    for w in range(arr_len):
        # Create an array to log their content, index, and unicode.
        n_arr.append({'c': arr[w], 'i': w, 'u': ord(arr[w])})
        # Create an object to calculate the proportion of same/used characters in the password → analyze the ingredients of the password.
        unicode_key = 'u_' + str(ord(arr[w]))
        json[unicode_key] = json.get(unicode_key, 0) + 1
        # Sort the array by unicode.
        n_arr.sort(key=lambda x: x['u'])
        # Calculate the total moving steps/distance of characters.
    for w in range(arr_len):
        distance += abs(w - n_arr[w]['i'])
    return distance / arr_len
    
def generate_data(tag, st, file_path):
    table = [["tag", "length", "average_distance", "point"]]
    result = {}
    startLen = 8
    endLen = 256
    lenInterval = 1
    sampleQuantity = 256
    rg = int((endLen - startLen) / lenInterval)
    p_prog = 0
    for i in range(rg):
        group = f"g_{i + startLen}"
        P = (i + startLen) / (endLen - 1)
        point = 90
        if P > 0.25:
            point = 96
        if P > 0.5:
            point = 97
        if P > 0.75:
            point = 98
        if P > 0.8:
            point = 99
        if P > 0.9:
            point = 100
        if group not in result:
            result[group] = {
                "point": point * st,
                "distances": [],
                "average_distance": 0,
                "length": i + startLen
            }
        for j in range(sampleQuantity):
            if st == 1:
                password = generate_password(i + startLen)
            else:
                password = generate_sorted_password(i + startLen)
            distance = calculateAverageMovedDistance(password)
            result[group]["distances"].append(distance)
        average_distance = sum(result[group]["distances"]) / len(result[group]["distances"])
        result[group]["average_distance"] = average_distance
        prog = ((i + startLen) / (endLen - 1) * 100)
        if prog - p_prog > 0.01:
            print(f"progress of {tag}: {prog:.0f}%{padding_spaces}", end='\r')
            p_prog = prog
    for key, value in result.items():
        table.append([tag, value["length"], value["average_distance"], value["point"]])
    with open(file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(table)
    return table

def generate_padding(a, b):
    table = [["tag", "length", "average_distance", "point"]]
    rg = int((b - a) * 100)
    for i in range(rg):
        table.append(["padding", 16, a + i / rg, 0])
    return table

def read_data(tag, file_path0, file_path1):
    P = []
    p_prog = 0
    # Open the file containing the password list
    with open(file_path0, 'r') as file:
        # Read each line (password) in the file
        for word in file:
            # Process the password (e.g., print it)
            L = list(word.strip()) # Use strip() to remove any leading or trailing whitespace
            P.append(L)
    table = [["tag", "length", "average_distance", "point"]]
    result = {}
    rg = len(P)
    o = 0
    for password in P:
        length = len(password)
        group = f"g_{length}"
        point = -50
        result[group] = {
            "point": point,
            "distances": [],
            "average_distance": 0,
            "length": length
        }
        distance = calculateAverageMovedDistance(password)
        result[group]["distances"].append(distance)
        prog = ((o) / (rg - 1) * 100)
        if prog - p_prog > 0.01:
            print(f"progress of {tag}: {prog:.0f}%{padding_spaces}", end='\r')
            p_prog = prog
        o += 1
    for key, value in result.items():
        average_distance = sum(result[key]["distances"]) / len(result[key]["distances"])
        result[key]["average_distance"] = average_distance
    for key, value in result.items():
        table.append([tag, value["length"], value["average_distance"], value["point"]])
    with open(file_path1, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(table)
    return table

names10178 = read_data("names10178", "names.txt", "names10178.csv")
top204 = read_data("top204", "Top204Thousand-WPA-probable-v2.txt", "top204.csv")
top304 = read_data("top304", "Top304Thousand-probable-v2.txt", "top304.csv")
top1000000 =read_data("top1000000", "10-million-password-list-top-1000000.txt", "top1000000.csv")
rd = generate_data("random", 1, "random.csv")
sd = generate_data("sorted", 0, "sorted.csv")

sl = slice(1, None, None)
ol = top304[sl] + top204[sl] + top1000000[sl] + rd[sl] + sd[sl] + names10178[sl]
ol.sort(key=lambda x: x[2])
pl = [["tag", "length", "average_distance", "point"]] + ol
with open("all.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(pl)

x = []
y = []
for i in ol:
    x.append(i[2])
    y.append(i[3])

# Fit a polynomial of degree 3 (cubic)
coefficients = np.polyfit(x, y, deg=3)
convertedCoefficients = []
for c in coefficients:
    convertedCoefficients.append(float(c))
print(convertedCoefficients)

with open("coef.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows([convertedCoefficients])