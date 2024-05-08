import re
import csv
import pandas as pd
from django.conf import settings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Initialization
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

lemmatizer = WordNetLemmatizer()
stop_word = set(stopwords.words('english'))

import os


def load_data(filepath):
    data = []
    with open(filepath, 'r') as f:
        reader = csv.reader(f, dialect='excel-tab')
        for row in reader:
            data.append(row)
    return data

def create_dataframe(data):
    book_id = []
    book_name = []
    summary = []
    genre = []
    for i in data:
        book_id.append(i[0])
        book_name.append(i[2])
        genre.append(i[5])
        summary.append(i[6])
    return pd.DataFrame({'book_id': book_id, 'book_name': book_name, 'genre': genre, 'summary': summary})

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z]', " ", text)
    tokenized = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(word) for word in tokenized]
    return " ".join(tokens)

def preprocess_dataframe(df, column_names):
    for column_name in column_names:
        df[column_name] = df[column_name].apply(preprocess_text)
    return df

def vectorize_data(df, column_name):
    tf = TfidfVectorizer(analyzer="word", ngram_range=(1, 2), min_df=0.0, stop_words='english')
    tfidf_matrix = tf.fit_transform(df[column_name])
    return tfidf_matrix

def get_recommendations_total(tfidf_matrix, df, liked_book_titles, top_n=100):
    cosine_sim = cosine_similarity(tfidf_matrix)

    # Get indices for books user has liked
    liked_indices = [df.index[df['book_name'] == title].tolist()[0] for title in liked_book_titles if title in df['book_name'].values]
    
    # Calculate average similarity for liked books
    avg_similarity = cosine_sim[liked_indices].mean(axis=0)

    # Get the top indices based on similarity
    top_similar_indices = avg_similarity.argsort()[::-1][:top_n + len(liked_indices)]

    recommended_indices = [idx for idx in top_similar_indices if df.iloc[idx]['book_name'] not in liked_book_titles]
    recommended_books = df.iloc[recommended_indices]['book_name'].tolist()

    return recommended_books

# def get_Recs_single(tfidf_matrix, df, liked_book_titles, top_n=100):
#     liked_indices = [df.index[df['book_name'] == title].tolist()[0] for title in liked_book_titles if title in df['book_name'].values]
#     avg =[]
#     for i in liked_indices:
#         cosine_similarity[i].man

def load_data():
    data = []
    if(not os.path.exists('./apiFolder/info/booksummaries.txt')):
        FileNotFoundError
    with open("./apiFolder/info/booksummaries.txt", 'r',encoding='utf-8') as f:
        reader = csv.reader(f, dialect='excel-tab')
        for row in reader:
            data.append(row)
    book_id = []
    book_name = []
    summary = []
    genre = []
# Iterate over the rows in the data

    for i in data:
  # Extract the information for each column and store it in the corresponding list
        book_id.append(i[0])
        book_name.append(i[2])
        genre.append(i[5])
        summary.append(i[6])

    books = pd.DataFrame({'book_id': book_id, 'book_name': book_name,
                       'genre': genre, 'summary': summary})
    return books
# Example usage within Django
def run_recommendation_total_system(liked_books):
    #filepath = 'info/booksummaries.txt'
    df = load_data()
    #df = create_dataframe(data)
    
    df = preprocess_dataframe(df, ['book_name', 'summary'])
    lst = []
    for book in liked_books:
        trt = liked_books[book]
        lst.append({'book_name': trt['title'], 'summary': preprocess_text(trt['description'])})
    
    new_books_df = pd.DataFrame(lst)

# Concatenate this DataFrame with the existing DataFrame
    df = pd.concat([new_books_df, df], ignore_index=True)
    


    tfidf_matrix = vectorize_data(df, 'summary')

    df = preprocess_dataframe(df, ['book_name', 'summary'])
    tfidf_matrix = vectorize_data(df, 'summary')

# Generate indices for liked books if they are in the DataFrame
    liked_books_indices = list(range(len(liked_books)))
    
    recommendations = get_recommendations_total(tfidf_matrix, df,liked_books_indices)          
    print(recommendations)
    return recommendations


