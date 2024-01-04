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
    filtered_words = [word for word in words if word not in stop_words and len(word) > 1]
    return ' '.join(filtered_words)

text = sys.argv[1]
output_path = sys.argv[2]

stop_words = [ 
    "教案","教案紙","課輔","素養","隊輔","老師","投影片","投影","影片","筆電","簡報","課程","ppt","分鐘","附錄",
    "小朋友","小孩","什麼","上課","下課","這個","那個","這些","那些","這樣","那樣","這裡","那裡","這麼","那麼",
    "這位","那位","可以","能夠","應該","不會","不要","不是","不會",
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
