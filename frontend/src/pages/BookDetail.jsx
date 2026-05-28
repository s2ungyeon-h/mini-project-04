import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';

const CONTENT_LIMIT = 150;

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookUrl = 'http://localhost:3000/books';
  const commentUrl = 'http://localhost:3000/comments';

  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentPassword, setCommentPassword] = useState('');
  const [commentLoading, setCommentLoading] = useState(true);
  const [pwPrompt, setPwPrompt] = useState(null);
  const [contentExpanded, setContentExpanded] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${bookUrl}/${id}`);
        if (!res.ok) throw new Error('도서 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/books');
      } finally {
        setBookLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentLoading(true);
      try {
        // json-server v1 쿼리 파라미터 타입 불일치 방지 → 전체 조회 후 클라이언트 필터링
        const res = await fetch(commentUrl);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        setComments(data.filter((c) => String(c.bookId) === String(id)));
      } catch (err) {
        console.error('댓글을 불러오지 못했습니다.', err);
      } finally {
        setCommentLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`"${book.title}"을(를) 삭제 도서로 이동할까요?`)) return;
    try {
      const res = await fetch(`${bookUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('삭제 도서 이동 실패');
      alert('삭제 도서로 이동했습니다.');
      navigate('/books/deleted');
    } catch (err) {
      console.error(err);
      alert('삭제 도서 이동에 실패했습니다.');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment = {
      bookId: id,
      author: commentAuthor.trim() || '익명',
      text: commentText.trim(),
      password: commentPassword,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(commentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setComments((prev) => [...prev, saved]);
      setCommentText('');
      setCommentAuthor('');
      setCommentPassword('');
    } catch {
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const openPwPrompt = (comment, mode) => {
    setPwPrompt({ id: comment.id, mode, pw: '', editText: comment.text, storedPw: comment.password });
  };

  const closePwPrompt = () => setPwPrompt(null);

  const handlePwConfirm = async () => {
    if (pwPrompt.pw !== pwPrompt.storedPw) {
      alert('비밀번호가 올바르지 않습니다.');
      return;
    }
    if (pwPrompt.mode === 'delete') {
      try {
        const res = await fetch(`${commentUrl}/${pwPrompt.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setComments((prev) => prev.filter((c) => c.id !== pwPrompt.id));
        closePwPrompt();
      } catch {
        alert('댓글 삭제에 실패했습니다.');
      }
    } else {
      try {
        const res = await fetch(`${commentUrl}/${pwPrompt.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pwPrompt.editText }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        closePwPrompt();
      } catch {
        alert('댓글 수정에 실패했습니다.');
      }
    }
  };

  if (bookLoading) return <p className="loading-text">도서 정보를 불러오는 중...</p>;
  if (!book) return null;

  const tagsArray = book.tag ? book.tag.split(',').filter(Boolean) : [];

  return (
    <div className="bd-page">
      <div className="bd-card">
        <div className="bd-btn-row">
          <button className="bd-edit-btn" onClick={() => navigate(`/books/${id}/edit`)}>수정</button>
          <button className="bd-delete-btn" onClick={handleDelete}>삭제</button>
        </div>

        <div className="bd-top">
          <div className="bd-cover-wrap">
            <img src={book.coverImageUrl || noCover} alt={book.title} className="bd-cover-img" />
          </div>

          <div className="bd-info-col">
            <div className="bd-title-row">
              <h2 className="bd-title">{book.title}</h2>
              <span className="bd-likes">❤️ {book.likes ?? 0}</span>
            </div>

            <p className="bd-author">저자: {book.author}</p>

            <span className="bd-genre-badge">{book.genre}</span>

            <div className="bd-tag-row">
              {tagsArray.map((t, idx) => (
                <span key={idx} className="bd-tag">#{t.trim()}</span>
              ))}
            </div>

            <div className="bd-content-box">
              <h4 className="bd-content-label">도서 내용</h4>
              <p className="bd-content-text">
                {contentExpanded || book.content.length <= CONTENT_LIMIT
                  ? book.content
                  : book.content.slice(0, CONTENT_LIMIT) + '...'}
              </p>
              {book.content.length > CONTENT_LIMIT && (
                <button
                  onClick={() => setContentExpanded((prev) => !prev)}
                  className="bd-more-btn"
                >
                  {contentExpanded ? '접기 ▲' : '더보기 ▼'}
                </button>
              )}
            </div>

            <div className="bd-date-wrap">
              <p className="bd-date">등록일: {book.createdAt ? book.createdAt.split('T')[0] : '-'}</p>
              <p className="bd-date">수정일: {book.updatedAt ? book.updatedAt.split('T')[0] : '-'}</p>
            </div>
          </div>
        </div>

        <div className="bd-comments">
          <h3 className="bd-comments-title">
            💬 댓글 {comments.length > 0 && <span className="bd-comments-count">{comments.length}</span>}
          </h3>

          {commentLoading ? (
            <p className="bd-comment-empty">댓글을 불러오는 중...</p>
          ) : comments.length === 0 ? (
            <p className="bd-comment-empty">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
          ) : (
            <ul className="bd-comment-list">
              {comments.map((c) => (
                <li key={c.id} className="bd-comment-item">
                  <div className="bd-comment-header">
                    <span className="bd-comment-author">{c.author}</span>
                    <span className="bd-comment-date">{c.createdAt?.split('T')[0]}</span>
                    <button className="bd-comment-action" onClick={() => openPwPrompt(c, 'edit')}>수정</button>
                    <button className="bd-comment-action bd-comment-action--delete" onClick={() => openPwPrompt(c, 'delete')}>삭제</button>
                  </div>

                  {pwPrompt?.id === c.id ? (
                    <div className="bd-pw-box">
                      {pwPrompt.mode === 'edit' && (
                        <textarea
                          value={pwPrompt.editText}
                          onChange={(e) => setPwPrompt((p) => ({ ...p, editText: e.target.value }))}
                          rows={2}
                          className="bd-comment-textarea bd-comment-textarea--edit"
                        />
                      )}
                      {pwPrompt.mode === 'delete' && (
                        <p className="bd-pw-msg">이 댓글을 삭제하려면 비밀번호를 입력하세요.</p>
                      )}
                      <div className="bd-pw-row">
                        <input
                          type="password"
                          placeholder="비밀번호"
                          value={pwPrompt.pw}
                          onChange={(e) => setPwPrompt((p) => ({ ...p, pw: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handlePwConfirm()}
                          className="bd-pw-input"
                          autoFocus
                        />
                        <button className="bd-pw-confirm" onClick={handlePwConfirm}>
                          {pwPrompt.mode === 'edit' ? '수정 완료' : '삭제'}
                        </button>
                        <button className="bd-pw-cancel" onClick={closePwPrompt}>취소</button>
                      </div>
                    </div>
                  ) : (
                    <p className="bd-comment-text">{c.text}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="bd-comment-form">
            <div className="bd-comment-input-row">
              <div className="bd-comment-fields">
                <div className="bd-comment-meta">
                  <input
                    type="text"
                    placeholder="작성자 (선택)"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="bd-comment-field"
                  />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={commentPassword}
                    onChange={(e) => setCommentPassword(e.target.value)}
                    className="bd-comment-field"
                  />
                </div>
                <textarea
                  placeholder="댓글을 입력하세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  rows={2}
                  className="bd-comment-textarea"
                />
              </div>
              <button
                className="bd-comment-submit"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
