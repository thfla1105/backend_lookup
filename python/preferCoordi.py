import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import os
import sys
import json
from ast import literal_eval
import warnings
from sklearn.feature_extraction.text import CountVectorizer
import argparse
import random

warnings.filterwarnings(action='ignore')
fashions=pd.read_csv("/workspace/mj_nodejs/csv/coordiList.csv",encoding='utf-8')

fashions_df=fashions[['idnum','styles','coordi_literal','dress','top','bottom','outwear','temp','weight','count']]

from sklearn.metrics.pairwise import euclidean_distances
from sklearn.feature_extraction.text import TfidfVectorizer


cnt_vect=CountVectorizer(min_df=0) #ngram_range=(1,2))
coordi_vect=cnt_vect.fit_transform(fashions_df['coordi_literal']).toarray()


coordi_sim=1/(euclidean_distances(coordi_vect,coordi_vect)+1e-5)


st=sys.argv[1].split(',')
temp=int(sys.argv[2])
style=sys.argv[3]

coordi_sim_idx=coordi_sim.argsort()[:,::-1]            
def find_sim_coordi2(df, sorted_idx,coordi_idnum,top_n=30):
            coordi_id=df[df['idnum']==coordi_idnum]
            coordi_idx=coordi_id.index.values
                        

            top_sim_idx=sorted_idx[coordi_idx,:top_n]
            #print(top_sim_idx)
            top_sim_idx=top_sim_idx.reshape(-1,)
            similar_co=df.iloc[top_sim_idx]
            
            return similar_co

similar_coordi=pd.DataFrame(columns=['idnum','styles','coordi_literal','dress','top','bottom','outwear','temp','weight','count'])

for v in st:
    s=pd.DataFrame(columns=['idnum','styles','coordi_literal','dress','top','bottom','outwear','temp','weight','count'])
    v=int(v)
    s=find_sim_coordi2(fashions_df,coordi_sim_idx,v)
    similar_coordi=pd.concat([similar_coordi,s],ignore_index=True)


#print(similar_coordi[['idnum','coordi_literal','styles','temp']])
similar_style=similar_coordi.loc[(similar_coordi['styles']==style)&(similar_coordi['temp']==temp)]
#randomNum = random.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 2)
similar_style=similar_style.sample(2)
#similar_json=similar_style.to_json(orient ='records')
#similar_style=similar_style[randomNum[0]]

#similar_json=similar_style.to_json(orient ='split')
#print(similar_json)

similar_list=list(similar_style['idnum'])
print(similar_list)




#print(type(similar_style))
#print(similar_style[['idnum','coordi_literal','styles','temp']])