import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

function BookList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 컴포넌트 로드 시 서버에서 데이터를 가져오는 로직 추가
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/books");
        
        if (!res.ok) {
          throw new Error("서버 응답 오류");
        }
        
        const data = await res.json();
        setBooks(data);
        
      } catch (error) {
        console.error("도서 목록 로딩 실패:", error);
        alert("검색 결과를 불러오지 못했습니다.");
      }
    };

    fetchBooks();
  }, []);

  // 추천 카운트 증가 함수 (서버 반영 버전)
  const handleLike = async (id, currentLikes) => {
    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentLikes + 1 }),
      });

      if (!res.ok) throw new Error("좋아요 반영 실패");

      // 로컬 state 업데이트
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, likes: book.likes + 1 } : book
        )
      );
    } catch (error) {
      console.error(error);
      alert("처리에 실패했습니다.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      (book.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.author?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>도서 목록 페이지</h1>

      <div style={styles.searchBar}>
        <Input
          name="search"
          placeholder="제목 또는 작가를 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <Button 
          label="검색" 
          onClick={() => alert(`'${searchTerm}' 검색 결과입니다.`)} 
          style={styles.searchButton}
        />
      </div>

      <div style={styles.bookList}>
        {filteredBooks.map((book) => (
          <div key={book.id} style={styles.bookCard}>
            <img
              // BookRegister에서 사용하는 coverImageUrl 필드와 하드코딩 필드 양쪽 모두 지원되도록 처리
              src={book.coverImageUrl || book.coverImage || "https://via.placeholder.com/120x160?text=No+Image"}
              alt={`${book.title} 표지`}
              style={styles.coverImage}
            />
            
            <div style={styles.bookInfo}>
              <h3 style={styles.bookTitle}>{book.title}</h3>
              <p style={styles.bookAuthor}>작가: {book.author}</p>
              <p style={styles.firstSentence}>
                {/* BookRegister에서 사용하는 content 필드와 하드코딩 필드 양쪽 모두 지원되도록 처리 */}
                <em>"{book.content || book.firstSentence || "등록된 소개글이 없습니다."}"</em>
              </p>
              
              <Button
                label={`👍 추천 (${book.likes || 0})`}
                onClick={() => handleLike(book.id, book.likes || 0)}
                style={styles.likeButton}
              />
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p style={styles.noResult}>검색 결과와 일치하는 도서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" },
  pageTitle: { textAlign: "center", marginBottom: "25px", color: "#333" },
  searchBar: { display: "flex", gap: "10px", marginBottom: "30px" },
  input: { flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "14px" },
  searchButton: { padding: "10px 20px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  bookList: { display: "flex", flexDirection: "column", gap: "20px" },
  bookCard: { display: "flex", border: "1px solid #eaeaea", padding: "20px", borderRadius: "8px", gap: "20px", backgroundColor: "#f9f9f9" },
  coverImage: { width: "120px", height: "160px", objectFit: "cover", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  bookInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" },
  bookTitle: { margin: 0, fontSize: "20px", color: "#222" },
  bookAuthor: { margin: 0, color: "#666", fontSize: "14px" },
  firstSentence: { margin: "5px 0 10px 0", color: "#555", fontStyle: "italic", fontSize: "14px", backgroundColor: "#fff", padding: "8px", borderRadius: "4px", borderLeft: "3px solid #007bff" },
  likeButton: { alignSelf: "flex-start", backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  noResult: { textAlign: "center", color: "#999", padding: "20px" }
};

export default BookList;