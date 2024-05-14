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
    tokens = [lemmatizer.lemmatize(word) for word in tokenized if word not in stop_word]
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
    print("Liked titles:", liked_book_titles)
    
    liked_indices = [df.index[df['book_name'].str.lower() == title.lower()].tolist() for title in liked_book_titles]
    liked_indices = [item for sublist in liked_indices for item in sublist]  # Flatten the list

    if not liked_indices:
        print("No liked indices found, returning empty list.")
        return []

    print("Liked indices:", liked_indices)
    cosine_sim = cosine_similarity(tfidf_matrix)
    avg_similarity = cosine_sim[liked_indices].mean(axis=0)

    top_similar_indices = avg_similarity.argsort()[::-1][:top_n + len(liked_indices)]
    recommended_indices = [idx for idx in top_similar_indices if idx not in liked_indices]

    recommended_books = df.iloc[recommended_indices]['book_name'].tolist()
    print("Recommended books:", recommended_books)

    return recommended_books

def load_books_data():
    data = []
    if not os.path.exists('./apiFolder/info/booksummaries.txt'):
        raise FileNotFoundError("File not found: ./apiFolder/info/booksummaries.txt")
    
    with open("./apiFolder/info/booksummaries.txt", 'r', encoding='utf-8') as f:
        reader = csv.reader(f, dialect='excel-tab')
        for row in reader:
            data.append(row)
    
    book_id = []
    book_name = []
    summary = []
    genre = []
    for i in data:
        book_id.append(i[0])
        book_name.append(i[2])
        genre.append(i[5])
        summary.append(i[6])

    books = pd.DataFrame({'book_id': book_id, 'book_name': book_name, 'genre': genre, 'summary': summary})
    return books

def run_recommendation_total_system(liked_books):
    df = load_books_data()
    df = preprocess_dataframe(df, ['book_name', 'summary'])

    lst = [{'book_name': liked_books[book]['title'], 'summary': preprocess_text(liked_books[book]['description'])} for book in liked_books]
    new_books_df = pd.DataFrame(lst)

    df = pd.concat([new_books_df, df], ignore_index=True)
    tfidf_matrix = vectorize_data(df, 'summary')

    liked_books_titles = [liked_books[book]['title'] for book in liked_books]
    recommendations = get_recommendations_total(tfidf_matrix, df, liked_books_titles)
    return recommendations