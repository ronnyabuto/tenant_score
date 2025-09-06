"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, FileText, Upload, CheckCircle, Clock, AlertTriangle, Download, Eye, Trash2, Plus, Search, Filter, Shield, FileCheck, Signature } from "lucide-react"

interface Document {
  id: string
  name: string
  type: "lease_agreement" | "id_document" | "receipt" | "photo" | "other"
  category: "tenant_documents" | "property_documents" | "financial_records"
  tenantId?: string
  unitNumber?: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadedBy: string
  uploadedAt: string
  isVerified?: boolean
  verifiedBy?: string
  verifiedAt?: string
  tags: string[]
  description?: string
  expiryDate?: string
  isActive: boolean
  signatureRequired: boolean
  signedBy?: string[]
  signedAt?: string
  createdAt: string
  updatedAt: string
}

interface DocumentDashboardProps {
  onBack: () => void
}

export default function DocumentDashboard({ onBack }: DocumentDashboardProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"list" | "categories" | "upload">("list")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents')
      const data = await response.json()
      if (data.success) {
        setDocuments(data.data)
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const verifyDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${documentId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy: 'admin' })
      })
      
      if (response.ok) {
        await loadDocuments()
        if (selectedDocument?.id === documentId) {
          const updatedDoc = documents.find(d => d.id === documentId)
          if (updatedDoc) setSelectedDocument(updatedDoc)
        }
      }
    } catch (error) {
      console.error('Failed to verify document:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lease_agreement": return <FileCheck className="w-5 h-5 text-blue-600" />
      case "id_document": return <Shield className="w-5 h-5 text-green-600" />
      case "receipt": return <FileText className="w-5 h-5 text-purple-600" />
      case "photo": return <Eye className="w-5 h-5 text-orange-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tenant_documents": return "bg-blue-100 text-blue-800"
      case "property_documents": return "bg-green-100 text-green-800"
      case "financial_records": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow && expiry > now
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesVerification = 
      verificationFilter === "all" || 
      (verificationFilter === "verified" && doc.isVerified) ||
      (verificationFilter === "pending" && !doc.isVerified)
    const matchesSearch = !searchTerm || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesType && matchesVerification && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto ios-card animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (selectedDocument) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedDocument(null)}
                className="flex items-center text-blue-600 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Document Details</h1>
              <div className="w-12"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Document Info */}
          <div className="ios-card">
            <div className="flex items-start space-x-3 mb-4">
              {getTypeIcon(selectedDocument.type)}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{selectedDocument.name}</h2>
                <p className="text-sm text-gray-600">{selectedDocument.fileName}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedDocument.category)}`}>
                    {selectedDocument.category.replace('_', ' ')}
                  </span>
                  {selectedDocument.isVerified ? (
                    <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  )}
                  {isExpiringSoon(selectedDocument.expiryDate) && (
                    <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Expiring
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedDocument.description && (
              <p className="text-gray-700 mb-4">{selectedDocument.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">File Size:</span>
                <p className="font-medium">{formatFileSize(selectedDocument.fileSize)}</p>
              </div>
              <div>
                <span className="text-gray-500">Uploaded:</span>
                <p className="font-medium">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</p>
              </div>
              {selectedDocument.unitNumber && (
                <div>
                  <span className="text-gray-500">Unit:</span>
                  <p className="font-medium">{selectedDocument.unitNumber}</p>
                </div>
              )}
              {selectedDocument.expiryDate && (
                <div>
                  <span className="text-gray-500">Expires:</span>
                  <p className={`font-medium ${isExpiringSoon(selectedDocument.expiryDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(selectedDocument.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="ios-card">
            <h3 className="font-semibold text-gray-900 mb-3">Verification Status</h3>
            {selectedDocument.isVerified ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Document Verified</p>
                  <p className="text-sm text-gray-600">
                    Verified by {selectedDocument.verifiedBy} on{' '}
                    {selectedDocument.verifiedAt ? new Date(selectedDocument.verifiedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">Pending Verification</p>
                    <p className="text-sm text-gray-600">Document is waiting for admin review</p>
                  </div>
                </div>
                <button
                  onClick={() => verifyDocument(selectedDocument.id)}
                  className="ios-button bg-green-500 w-full flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Document</span>
                </button>
              </div>
            )}
          </div>

          {/* Signature Status */}
          {selectedDocument.signatureRequired && (
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Signature Status</h3>
              {selectedDocument.signedBy && selectedDocument.signedBy.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Signature className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Signed by: {selectedDocument.signedBy.join(', ')}</p>
                      <p className="text-sm text-gray-600">
                        Signed on {selectedDocument.signedAt ? new Date(selectedDocument.signedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Signature className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No signatures yet</p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {selectedDocument.tags.length > 0 && (
            <div className="ios-card">
              <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="ios-button bg-blue-500 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="ios-button bg-gray-200 text-gray-700 flex items-center justify-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center text-blue-600 font-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Documents</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="ios-card text-center">
            <div className="text-2xl font-bold text-gray-900">{documents.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="ios-card text-center">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.isVerified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="ios-card text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(d => !d.isVerified).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="ios-card">
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "list", label: "All Documents", icon: FileText },
              { key: "categories", label: "By Category", icon: FileCheck },
              { key: "upload", label: "Upload New", icon: Upload }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setView(option.key as any)}
                className={`py-3 px-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                  view === option.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span className="text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        {view === "list" && (
          <div className="ios-card">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ios-input pl-10"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="ios-input text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="tenant_documents">Tenant Documents</option>
                    <option value="property_documents">Property Documents</option>
                    <option value="financial_records">Financial Records</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="ios-input text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="lease_agreement">Lease Agreements</option>
                      <option value="id_document">ID Documents</option>
                      <option value="receipt">Receipts</option>
                      <option value="photo">Photos</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={verificationFilter}
                      onChange={(e) => setVerificationFilter(e.target.value)}
                      className="ios-input text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Document List */}
        {view === "list" && (
          <div className="space-y-3">
            {filteredDocuments.length === 0 ? (
              <div className="ios-card text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No documents found</p>
              </div>
            ) : (
              filteredDocuments.map((document) => (
                <button
                  key={document.id}
                  onClick={() => setSelectedDocument(document)}
                  className="ios-card w-full text-left active:scale-95 transition-transform"
                >
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(document.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{document.name}</h3>
                        {isExpiringSoon(document.expiryDate) && (
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{document.fileName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(document.category)}`}>
                            {document.category.replace('_', ' ')}
                          </span>
                          {document.isVerified ? (
                            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{formatFileSize(document.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Categories View */}
        {view === "categories" && (
          <div className="space-y-4">
            {["tenant_documents", "property_documents", "financial_records"].map(category => {
              const categoryDocs = documents.filter(doc => doc.category === category)
              const categoryName = category.replace('_', ' ')
              
              return (
                <div key={category} className="ios-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 capitalize">{categoryName}</h3>
                    <span className="text-sm text-gray-500">{categoryDocs.length} documents</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {categoryDocs.filter(d => d.isVerified).length}
                      </div>
                      <div className="text-xs text-gray-500">Verified</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-600">
                        {categoryDocs.filter(d => !d.isVerified).length}
                      </div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { setCategoryFilter(category); setView("list") }}
                    className="mt-3 w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors hover:bg-gray-200"
                  >
                    View All {categoryName}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Upload View */}
        {view === "upload" && (
          <div className="ios-card">
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Upload New Document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select files to upload. Supported formats: PDF, JPG, PNG
              </p>
              <button className="ios-button bg-blue-500 flex items-center justify-center space-x-2 mx-auto">
                <Upload className="w-4 h-4" />
                <span>Choose Files</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}