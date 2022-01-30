# -*- coding: utf-8 -*-

import sys, os
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from matplotlib.image import imread

from keras.utils import np_utils
from keras.models import load_model
from PIL import Image
#import pandas as pd
import csv

#파일이 여러개일 때
image_files = []
for i in range(1, len(sys.argv)):
    image_files.append(sys.argv[i])
#print(image_files)

#files=['/workspace/mj_nodejs/images/cardigan.jpg', '/workspace/mj_nodejs/images/longblouse.jpg']

# 결과 예측하는 함수
def category_total(image_files):
    results = []
    image_size = 64

    X = []
    files = []

    f = open('/workspace/mj_nodejs/csv/train.csv','r', encoding='utf-8')
    r = csv.reader(f)
    headers = next(r)
    f.close()
    classes = headers[2:]
    classes.sort()

    for fname in image_files:
        img = Image.open(fname)
        img = img.convert("RGB")
        img = img.resize((image_size, image_size))
        in_data = np.asarray(img)
        in_data = in_data.astype("float") / 256
        X.append(in_data)
        files.append(fname)

    X = np.array(X)
    model = load_model('/workspace/mj_nodejs/model/model.h5')

    pre = model.predict(X)

    for i, p in enumerate(pre):
        y = p.argmax()
        #print("입력:", files[i])    # 정답
        #print("예측:", "[", y, "]", classes[y], "/ Score", p[y])
        #print("\n")
        results.append(classes[y])
    
    print(results)
    #return results

# 실행
category_total(image_files)
