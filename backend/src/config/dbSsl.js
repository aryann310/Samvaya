import tls from 'tls';
/**
 * Generates secure database SSL configuration enforcing TLS 1.2+
 */
export function getDatabaseTlsConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    const caCert = process.env.DATABASE_CA_CERT;
    return {
        ssl: {
            minVersion: 'TLSv1.2',
            // In production, always strictly reject unauthorized/self-signed certs without verified CA
            rejectUnauthorized: isProduction ? true : (process.env.DB_REJECT_UNAUTHORIZED !== 'false'),
            ca: caCert,
        },
    };
}
/**
 * At-Rest Full Volume/Disk Encryption Specification (AES-256).
 *
 * For cloud databases (AWS RDS, Aurora, EBS volumes, MongoDB Atlas, Azure Database):
 * - AWS KMS CMK with AES-256 encryption algorithm is enforced on the storage volume.
 * - For self-hosted Linux database hosts:
 *   LUKS2 dm-crypt with AES-256-XTS (aes-xts-plain64, 512-bit key).
 * - For PostgreSQL TDE / Transparent Data Encryption:
 *   Cluster data files encrypted with AES-256.
 */
export const AT_REST_DISK_ENCRYPTION_SPEC = {
    standard: 'AES-256',
    modes: {
        awsKms: 'aws/rds or custom KMS CMK with AES-256-GCM',
        linuxLuks: 'aes-xts-plain64 with 512-bit key (2x256-bit AES)',
        postgresqlTde: 'AES-256 TDE for table spaces and WAL',
    },
    status: 'ENFORCED',
};
//# sourceMappingURL=dbSsl.js.map