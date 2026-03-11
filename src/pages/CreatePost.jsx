import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { v4 as uuidv4 } from 'uuid';
import './CreatePost.css';

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Gold Hoop Earrings', price: '₹899', category: 'Jewelry' },
  { id: 'p2', name: 'Pearl Drop Earrings', price: '₹650', category: 'Jewelry' },
  { id: 'p3', name: 'Silver Stud Earrings', price: '₹350', category: 'Jewelry' },
  { id: 'p4', name: 'White Sneakers', price: '₹3499', category: 'Footwear' },
  { id: 'p5', name: 'Running Shoes', price: '₹4299', category: 'Footwear' },
  { id: 'p6', name: 'Boho Maxi Dress', price: '₹2499', category: 'Clothing' },
  { id: 'p7', name: 'Oversized Jacket', price: '₹1999', category: 'Clothing' },
  { id: 'p8', name: 'Silk Blouse', price: '₹1799', category: 'Clothing' },
  { id: 'p9', name: 'Denim Jeans', price: '₹1299', category: 'Clothing' },
  { id: 'p10', name: 'Leather Handbag', price: '₹5999', category: 'Bags' },
  { id: 'p11', name: 'Sunglasses', price: '₹1499', category: 'Accessories' },
  { id: 'p12', name: 'Watch', price: '₹8999', category: 'Accessories' },
  { id: 'p13', name: 'Necklace', price: '₹999', category: 'Jewelry' },
  { id: 'p14', name: 'Bracelet Set', price: '₹599', category: 'Jewelry' },
];

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const mediaRef = useRef(null);

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);
  const [pendingCoords, setPendingCoords] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [step, setStep] = useState(1); // 1=upload, 2=details
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [customProduct, setCustomProduct] = useState({ name: '', price: '' });
  const [productLink, setProductLink] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    if (!file.type.startsWith('image/') && !isVideo) return;
    setMediaType(isVideo ? 'video' : 'image');
    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreview(url);
    setStep(2);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleImageClick = (e) => {
    if (mediaType === 'video') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingCoords({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
  };

  const filteredProducts = SAMPLE_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addTag = (product) => {
    if (!pendingCoords) return;
    const newTag = {
      id: uuidv4(),
      productName: product.name,
      price: product.price,
      link: productLink.trim() || '#',
      x: pendingCoords.x,
      y: pendingCoords.y,
    };
    setTags([...tags, newTag]);
    setPendingCoords(null);
    setProductSearch('');
    setProductLink('');
  };

  const addCustomTag = () => {
    if (!pendingCoords || !customProduct.name.trim()) return;
    const newTag = {
      id: uuidv4(),
      productName: customProduct.name.trim(),
      price: customProduct.price,
      link: productLink.trim() || '#',
      x: pendingCoords.x,
      y: pendingCoords.y,
    };
    setTags([...tags, newTag]);
    setPendingCoords(null);
    setCustomProduct({ name: '', price: '' });
  };

  const removeTag = (tagId) => setTags(tags.filter(t => t.id !== tagId));

  const handleSubmit = async () => {
    if (!mediaPreview || !caption.trim()) return;
    setLoading(true);
    try {
      createPost({
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        caption,
        mediaUrl: mediaPreview,
        mediaType,
        tags
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-header">
        <h1 className="create-title">Create Post</h1>
        <p className="create-subtitle">Share your style with the world</p>
      </div>

      {step === 1 && (
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <h3>Drop your photo or video here</h3>
          <p>or click to browse</p>
          <span className="upload-formats">JPG, PNG, GIF, MP4, MOV</span>
        </div>
      )}

      {step === 2 && (
        <div className="create-layout">
          {/* Media preview */}
          <div className="create-media-col">
            <div className="media-preview-wrap">
              {mediaType === 'image' ? (
                <img
                  ref={mediaRef}
                  src={mediaPreview}
                  alt="Preview"
                  className="media-preview"
                  onClick={handleImageClick}
                  style={{ cursor: 'crosshair' }}
                />
              ) : (
                <video src={mediaPreview} className="media-preview" controls />
              )}

              {/* Pending tag dot */}
              {pendingCoords && (
                <div className="pending-dot" style={{ left: `${pendingCoords.x}%`, top: `${pendingCoords.y}%` }}>
                  <span className="pending-dot-inner" />
                </div>
              )}

              {/* Placed tags */}
              {tags.map(tag => (
                <div key={tag.id} className="placed-tag-dot" style={{ left: `${tag.x}%`, top: `${tag.y}%` }}>
                  <span className="placed-dot-inner" />
                  <div className="placed-tag-label">
                    {tag.productName}
                    <button className="remove-tag-btn" onClick={() => removeTag(tag.id)}>×</button>
                  </div>
                </div>
              ))}
            </div>

            {mediaType === 'image' && (
              <p className="tag-hint">
                {pendingCoords ? '👇 Select a product below to tag it' : '👆 Click on the image to tag a product'}
              </p>
            )}
          </div>

          {/* Details col */}
          <div className="create-details-col">
            <div className="user-preview">
              <img src={user?.avatar} alt={user?.name} />
              <div>
                <span className="name">{user?.name}</span>
                <span className="handle">@{user?.username}</span>
              </div>
            </div>

            <div className="form-group" style={{marginBottom:'20px'}}>
              <label className="field-label">Caption</label>
              <textarea
                className="input-field caption-area"
                placeholder="Write a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={4}
              />
            </div>

            {/* Product selector (shows when pending coords set) */}
            {pendingCoords && (
              <div className="product-selector fade-in">
                <h4>Tag a product</h4>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  style={{marginBottom:'10px'}}
                />
                <div className="form-group" style={{marginBottom:'10px'}}>
                  <label style={{fontSize:'0.78rem',color:'var(--text3)',display:'block',marginBottom:'5px'}}>Purchase Link (optional)</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://amazon.in/product..."
                    value={productLink}
                    onChange={e => setProductLink(e.target.value)}
                  />
                </div>
                <div className="products-list">
                  {filteredProducts.slice(0, 8).map(p => (
                    <button key={p.id} className="product-item" onClick={() => addTag(p)}>
                      <div>
                        <span className="p-name">{p.name}</span>
                        <span className="p-cat">{p.category}</span>
                      </div>
                      <span className="p-price">{p.price}</span>
                    </button>
                  ))}
                </div>
                <div className="custom-product">
                  <p className="custom-label">Or add custom product:</p>
                  <input
                    type="text" className="input-field" placeholder="Product name"
                    value={customProduct.name}
                    onChange={e => setCustomProduct({...customProduct, name: e.target.value})}
                    style={{marginBottom:'8px'}}
                  />
                  <div style={{display:'flex',gap:'8px'}}>
                    <input
                      type="text" className="input-field" placeholder="Price (e.g. ₹999)"
                      value={customProduct.price}
                      onChange={e => setCustomProduct({...customProduct, price: e.target.value})}
                    />
                    <button className="btn-primary" onClick={addCustomTag} disabled={!customProduct.name.trim()}>Add</button>
                  </div>
                </div>
                <button className="cancel-tag-btn" onClick={() => setPendingCoords(null)}>Cancel</button>
              </div>
            )}

            {/* Tagged products list */}
            {tags.length > 0 && !pendingCoords && (
              <div className="tagged-list">
                <h4>Tagged Products ({tags.length})</h4>
                {tags.map(tag => (
                  <div key={tag.id} className="tagged-item">
                    <div>
                      <span className="ti-name">{tag.productName}</span>
                      {tag.price && <span className="ti-price">{tag.price}</span>}
                    </div>
                    <button className="remove-tag-btn-sm" onClick={() => removeTag(tag.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="create-actions">
              <button className="btn-ghost" onClick={() => { setStep(1); setMediaPreview(''); setTags([]); }}>
                Change Media
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading || !caption.trim()}
              >
                {loading ? <span className="btn-spinner" /> : 'Share Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
