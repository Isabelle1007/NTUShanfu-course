import sys
from wordcloud import WordCloud
import jieba
import logging
import os

# Suppress jieba logging messages
jieba.setLogLevel(logging.INFO)

# Function to remove stop words from text
def remove_stop_words(text, stop_words):
    words = jieba.cut(text)
    filtered_words = [word for word in words if word not in stop_words]
    return ' '.join(filtered_words)

text = sys.argv[1]
output_path = sys.argv[2]

stop_words = [ 
    # "學年度", "台大", "台灣大學", "國立台灣大學","台大山服","慈幼山地服務團","山服",
    # "加拿","加拿家","新武","新武家","霧鹿","霧鹿家","利稻","利稻家","電光","電光家",
    "教案","教案紙","課輔","素養","隊輔","投影片","投影","影片" ,"簡報","課程","ppt","分鐘","附錄","小朋友","小孩",
    "什麼","上課","下課","這個","那個","這些","那些","這樣","那樣","這裡","那裡","這麼","那麼","這位","那位","可以",
    "的","與","第","在","是","年","月","日","於","為","及","等","有","也","而","與","或","之","以","及","著","了","就","這","那"
    
]

# Filter the text to remove stop words
filtered_text = remove_stop_words(text, stop_words)

# Relative path to the font file
font_path = os.path.join(os.path.dirname(__file__), 'NotoSansTC-VariableFont_wght.ttf')

wordcloud = WordCloud(
    width=320, 
    height=194, 
    background_color='white', 
    min_font_size=10, 
    font_path=font_path  # Specify the font path here
).generate(filtered_text)

wordcloud.to_file(output_path)
print(output_path)  # Print the file path
