import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from './styles';
import motoristaAgenteImg from '../../assets/img/motoristaAgente.jpeg';
import { Spinner } from '../../components/Spinner';
import { getPathImageDefault, getNameApplication, LogoMovyDefault } from '../../config/configApp';

const Audit = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  
  const driverId = searchParams.get('q');

  const fetchDriverData = async (id: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          driver: {
            id: id,
            status: "active"
          }
        });
      }, 1000);
    });
  };

  const loadDriverData = async () => {
    if (!driverId) {
      setError('QR code inválido ou parâmetro não encontrado.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchDriverData(driverId);
      
      if (response && (response as any).driver) {
        setLoading(false);
        setShowContent(true);
      } else {
        throw new Error('Motorista não encontrado');
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Erro ao carregar informações do motorista.');
    }
  };

  useEffect(() => {
    loadDriverData();
  }, [driverId]);

  return (
    <Container>
      {/* Navbar Audit */}
      <div className='nav-wrapper nav-audit'>
        <nav className='nav-bar-option nav-audit-simple'>
          <div className="container">
            <div className='brand-icon'>
              <a href="/">
                <img
                  src={getPathImageDefault()}
                  className='brand-logo left'
                  alt="Logo"
                  onError={(e) => {
                    e.currentTarget.src = LogoMovyDefault;
                  }}
                />
                <span className="project-name-nav">{getNameApplication()}</span>
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div id="audit-loading" className="audit-loading">
          <Spinner />
          <p>Carregando informações...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div id="audit-error" className="audit-error">
          <div className="container-home">
            <h2 className="describ-text" style={{textAlign: 'center'}}>
              <strong>QR code inválido</strong> ou motorista não encontrado no sistema.
            </h2>
            <div className="btn-center">
              <a href="javascript:window.location.reload()" className="btn-saiba-mais">Tentar novamente</a>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {showContent && (
        <div id="audit-content">
          <div className="audit-hero-image">
            <img src={motoristaAgenteImg} alt="Auditoria de Trânsito" className="desktop-img" />
            <img src={motoristaAgenteImg} alt="Auditoria de Trânsito" className="mobile-img" />
          </div>

          <div className="container-home">
            <div className="audit-text-wrapper">
              <h1 className="audit-title">Fiscalização evasiva</h1>
              <h2 className="describ-text">
                Sistema de <strong>verificação e auditoria</strong> de motoristas para fiscalização de trânsito. 
                Verifique documentos e status de forma rápida e eficiente através do <strong>QR code</strong> do motorista.
              </h2>
            </div>
          </div>

          <div className="audit-promotion-section">
            <div className="container-home">
              <div className="promotion-content">
                <h1>O melhor app com vantagens para motoristas e passageiros</h1>
                <p>Somos um aplicativo de mobilidade urbana, totalmente brasileiro, valorizamos nossos motoristas parceiros e passageiros, oferecendo vantagens e benefícios exclusivos</p>
                
                <div className="promotion-buttons">
                  <a href="/passageiro" className="btn-promotion">QUERO SER PASSAGEIRO</a>
                  <a href="/motorista" className="btn-promotion">QUERO SER MOTORISTA</a>
                </div>
              </div>
            </div>
          </div>


        </div>
      )}

      {/* Footer Audit */}
      <footer className="footer bg-dark-yellow">
        <div className='footer-container'>
          <div className='collun-container'>
            <img
              src={getPathImageDefault()}
              width='70px'
              alt="Logo"
              style={{marginBottom: '1vw'}}
              onError={(e) => {
                e.currentTarget.src = LogoMovyDefault;
              }}
            />
          </div>
        </div>
        <div className='copy'>
          <p><span className="project-name-footer">{getNameApplication()}</span> - Todos os direitos reservados.</p>
        </div>
      </footer>
    </Container>
  );
};

export default Audit;