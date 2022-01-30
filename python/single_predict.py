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


# 결과 예측하는 함수
def category_total():
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

    img = Image.open(sys.argv[1])
    img = img.convert("RGB")
    img = img.resize((image_size, image_size))
    in_data = np.asarray(img)
    in_data = in_data.astype("float") / 256
    X.append(in_data)
    files.append(sys.argv[1]) #js에서 받아온 인자값, sys.argv[0]은 파일 이름

    X = np.array(X)
    model = load_model('/workspace/mj_nodejs/model/model.h5')

    pre = model.predict(X)

    for i, p in enumerate(pre):
        y = p.argmax()
        results.append(classes[y])
    
    print(results[0]) #결과 내보내기
    #return results

# 실행
category_total()
