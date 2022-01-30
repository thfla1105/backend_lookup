import sys, os
import cv2
import numpy as np # linear algebra
#import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt

# 입력 영상 불러오기

#src=cv2.imread('mj_nodejs/images/outer_cardigan_40.jpg')
source = cv2.imread(sys.argv[1]) #받아온 인자값
src = cv2.resize(source, (500,500))

if src is None:
    print('Image load failed!')
    sys.exit()
    
# 사장형 지정을 통한 초기 분할
#rc = cv2.selectROI(src) # 초기 위치 지정하고 모서리 좌표 4개를 튜플값으로 반환
mask = np.zeros(src.shape[:2], np.uint8) # 마스크는 검정색으로 채워져있고 입력 영상과 동일한 크기#


rc=(1,1,src.shape[0],src.shape[1])
#print(src.shape)
# 결과를 계속 업데이트 하고 싶으면 bgd, fgd 입력
#Grab Cut the object
#Grab Cut the object
bgdModel = np.zeros((1,65),np.float64)      
fgdModel = np.zeros((1,65),np.float64)

cv2.grabCut(src, mask, rc ,None, None, 5, cv2.GC_INIT_WITH_RECT)

# grabCut 자료에서 0,2는 배경, 1,3은 전경입니다.
# mask == 0 or mask == 2를 만족하면 0으로 설정 아니면 1로 설정합니다
mask2 = np.where((mask == 0) | (mask == 2), 0, 1).astype('uint8')

# np.newaxis로 차원 확장
dst = src * mask2[:, :, np.newaxis]

background=src-dst
background[np.where((background > [0,0,0]).all(axis = 2))] = [255,255,255]
dst=background+dst


#X.append(in_data)
#files.append(sys.argv[1])
#X = np.array(X)
    
#cv2.imshow('dst', dst)
cv2.imwrite('/workspace/mj_nodejs/public/upload2bg/'+sys.argv[2]+'_removeBg.jpg',dst)

print(dst)

#imgPath='https://lookup.run.goorm.io/upload2bg/removeBg.jpg';
#print(imgPath)


