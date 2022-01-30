import sys

#print(sys.argv[0], sys.argv[1], sys.argv[2], sys.argv[3])
#a = int(sys.argv[1])
#b = int(sys.argv[2])
#c = a+b
#print(c)

#def add(a,b):
#    c = a+b
#    print(c)

#add(int(sys.argv[1]), int(sys.argv[2]))
#print(len(sys.argv))

img_files = []

for i in range(1, len(sys.argv)):
    img_files.append(i)

def print_list(img_files):
    print(img_files)

import numpy as np 
print(np.matrix([ [ 1, 2 ], [ 2, 3 ]]))

import tensorflow as tf
print(tf.__version__)

print(sys.argv[1], sys.argv[2])

import keras
print(keras.__version__)

print(sys.version)
    
#print_list(img_files)