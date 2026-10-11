import { FilterOutlined, PrinterOutlined } from '@ant-design/icons'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import Pagination from '@mui/material/Pagination'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import api from '../../../services/api'

interface FinancialMovement {
  flow: string
  color: string
  balanceFlowTypeId: number
  value: number
  summary: string
  tripReference: string
  date: string
  observation?: string | null
}

interface FinancialResponse {
  status: boolean
  response: {
    data: FinancialMovement[]
    last_page: number
  }
}

interface DriverResponse {
  status: boolean
  response: {
    name: string
  }
}

export default function DriverFinancial() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation<{ driverName?: string }>()
  const printRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [movements, setMovements] = useState<FinancialMovement[]>([])
  const [driverName, setDriverName] = useState<string>(location.state?.driverName || '')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const [filterStartDate, setFilterStartDate] = useState<string>('')
  const [filterEndDate, setFilterEndDate] = useState<string>('')

  // Busca o nome do motorista se não veio pelo state
  useEffect(() => {
    if (!driverName && id) {
      const fetchDriverName = async () => {
        try {
          const user = localStorage.getItem('@App:user')
          const userData = user ? JSON.parse(user) : null
          const res = await api.get<DriverResponse>(`/driver/${id}`, {
            headers: {
              token: userData?.api_token || '',
              userid: userData?.idUser || ''
            }
          })
          if (res.data?.response?.name) {
            setDriverName(res.data.response.name)
          } else {
            setDriverName('Motorista')
          }
        } catch {
          setDriverName('Motorista')
        }
      }
      fetchDriverName()
    }
  }, [id, driverName])

  // Busca os movimentos financeiros
  useEffect(() => {
    if (!id) return
    let userData: any = null
    try {
      const user = localStorage.getItem('@App:user')
      if (user && user !== 'undefined' && user !== 'null') {
        userData = JSON.parse(user)
      }
    } catch {}

    setLoading(true)
    let url = `/driver/${id}/financial-report?page=${page}`
    if (startDate) url += `&startDate=${startDate}`
    if (endDate) url += `&endDate=${endDate}`

    api
      .get<FinancialResponse>(url, {
        headers: {
          token: userData?.api_token || '',
          userid: userData?.idUser || ''
        }
      })
      .then((res) => {
        const d = res.data?.response?.data;
        setMovements(Array.isArray(d) ? d : (Array.isArray(res.data?.response) ? res.data.response : []));
        setTotalPages(res.data?.response?.last_page || 1);
      })
      .catch(() => setMovements([]))
      .finally(() => setLoading(false))
  }, [id, page, startDate, endDate])

  // Função para imprimir apenas o relatório
  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
    }
  }

  const handleOpenFilter = () => {
    setFilterStartDate(startDate)
    setFilterEndDate(endDate)
    setFilterOpen(true)
  }

  const handleApplyFilter = () => {
    setStartDate(filterStartDate)

    // Adiciona 1 dia ao endDate se estiver preenchido
    if (filterEndDate) {
      const end = new Date(filterEndDate)
      end.setDate(end.getDate() + 1)
      setEndDate(end.toISOString().slice(0, 10))
    } else {
      setEndDate('')
    }

    setPage(1)
    setFilterOpen(false)
  }

  return (
    <Box sx={{ p: 3, background: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Motorista{driverName ? ` - ${driverName}` : ''}
        </Typography>
        <Box>
          <IconButton onClick={handleOpenFilter}>
            <FilterOutlined style={{ fontSize: 24 }} />
          </IconButton>
          <IconButton onClick={handlePrint}>
            <PrinterOutlined style={{ fontSize: 24 }} />
          </IconButton>
        </Box>
      </Box>
      {/* Modal de filtro */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: '90vw',
            p: 4
          }
        }}
      >
        <DialogTitle sx={{ fontSize: 22, fontWeight: 500, pb: 1 }}>Filtrar por data</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            mt: 1
          }}
        >
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>Data inicial</FormLabel>
            <TextField
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              fullWidth
              label=""
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>Data final</FormLabel>
            <TextField
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              fullWidth
              label=""
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setFilterStartDate('')
              setFilterEndDate('')
            }}
          >
            LIMPAR
          </Button>
          <Button onClick={handleApplyFilter}>APLICAR</Button>
        </DialogActions>
      </Dialog>
      <div ref={printRef}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Últimas movimentações
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {(!movements || movements.length === 0) && (
                <Typography color="text.secondary">Nenhuma movimentação encontrada.</Typography>
              )}
              {(movements || []).map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 3,
                    pl: 2,
                    borderLeft: `4px solid ${item.color}`
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: item.color,
                      width: 16,
                      height: 16,
                      mt: '6px',
                      mr: 2
                    }}
                  />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.date).toLocaleString('pt-BR')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: item.color, fontWeight: 600 }}>
                      {item.summary}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Valor:{' '}
                      {item.value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </Typography>
                    {item.observation && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontStyle: 'italic',
                          color: 'text.secondary',
                          fontSize: '0.875rem'
                        }}
                      >
                        Detalhamento: {item.observation}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Paper>
      </div>
    </Box>
  )
}
